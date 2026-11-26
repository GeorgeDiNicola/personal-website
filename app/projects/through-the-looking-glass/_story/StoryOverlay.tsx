'use client';

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { Board } from './Board';
import { SceneArt } from './SceneArt';
import { boardFocusTime, boardSettleTime, promotionPawnTime } from './playback';
import type { Piece, StoryEvent } from './types';
import shared from './LookingGlass.module.css';
import styles from './StoryOverlay.module.css';

/** Give each move the foreground before letting its illustration take over. */
export function StoryOverlay({
  event,
  speed,
  playing,
  onPiece,
  onInspect,
  onOpenMoments,
  onPause,
  children,
}: {
  event: StoryEvent;
  speed: number;
  playing: boolean;
  onPiece: (piece: Piece) => void;
  onInspect: () => void;
  onOpenMoments: () => void;
  onPause: () => void;
  children: ReactNode;
}) {
  const [animation, setAnimation] = useState<{
    event: StoryEvent;
    phase: 'before' | 'move' | 'story';
  }>({ event, phase: 'before' });
  const [holdBoard, setHoldBoard] = useState(false);
  const [showReadingCue, setShowReadingCue] = useState(false);
  const passageRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const boardControlRef = useRef<HTMLButtonElement>(null);
  // Reversing quickly must also begin a fresh reveal, even for a recently viewed event.
  if (animation.event !== event) {
    setAnimation({ event, phase: 'before' });
    // Board inspection belongs to this scene; carrying it forward hides the next illustration.
    setHoldBoard(false);
  }
  if (holdBoard && playing) setHoldBoard(false);
  const isOpening = event.kind === 'initial';
  const isPromotion = event.kind === 'promotion';
  const hasMove = Boolean(event.motion) || isPromotion || event.id === 'queens-palace';
  const moveDelay = isPromotion ? promotionPawnTime : boardSettleTime;
  const focusDuration = boardFocusTime(event, speed);
  const showingStory = (focusDuration === 0 || animation.phase === 'story') && !holdBoard;

  useLayoutEffect(() => {
    const stage = stageRef.current;
    const controls = stage?.closest('main')?.querySelector('footer');
    if (!stage || !controls) return;
    const viewport = window.visualViewport;
    let frame = 0;
    function measure() {
      if (!stage || !controls) return;
      const bounds = stage.getBoundingClientRect();
      const top = viewport?.offsetTop ?? 0;
      const left = viewport?.offsetLeft ?? 0;
      const width = viewport?.width ?? window.innerWidth;
      const bottom = Math.min(
        top + (viewport?.height ?? window.innerHeight),
        controls.getBoundingClientRect().top,
      );
      const height = Math.max(0, bottom - top);
      // Reserve space on both sides so the board itself stays centered and its exit fits.
      const size = Math.max(1, Math.min(800, width - 32, height - 128));
      stage.style.setProperty('--focused-board-size', `${size}px`);
      stage.style.setProperty(
        '--board-center-x',
        `${left + width / 2 - bounds.left - stage.clientLeft}px`,
      );
      stage.style.setProperty(
        '--board-center-y',
        `${top + height / 2 - bounds.top - stage.clientTop}px`,
      );
    }
    function scheduleMeasurement() {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(measure);
    }
    const observer = new ResizeObserver(scheduleMeasurement);
    observer.observe(stage);
    observer.observe(controls);
    window.addEventListener('resize', scheduleMeasurement);
    window.addEventListener('scroll', scheduleMeasurement, { passive: true });
    viewport?.addEventListener('resize', scheduleMeasurement);
    viewport?.addEventListener('scroll', scheduleMeasurement);
    measure();
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', scheduleMeasurement);
      window.removeEventListener('scroll', scheduleMeasurement);
      viewport?.removeEventListener('resize', scheduleMeasurement);
      viewport?.removeEventListener('scroll', scheduleMeasurement);
    };
  }, []);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!showingStory || isOpening || !stage || !window.matchMedia('(max-width: 999px)').matches)
      return;
    const viewportTop = window.visualViewport?.offsetTop ?? 0;
    if (stage.getBoundingClientRect().top >= viewportTop) return;

    // Returning from a scrolled passage can put the miniature above the viewport.
    // Place it directly on the illustration when the page also needs to move.
    stage.dataset.repositioned = '';
    stage.scrollIntoView({ block: 'start', behavior: 'instant' });
    return () => {
      delete stage.dataset.repositioned;
    };
  }, [showingStory, isOpening]);

  useEffect(() => {
    if (!holdBoard) return;
    boardControlRef.current?.focus({ preventScroll: true });
    const returnToStory = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !document.querySelector('dialog[open]')) setHoldBoard(false);
    };
    window.addEventListener('keydown', returnToStory);
    return () => window.removeEventListener('keydown', returnToStory);
  }, [holdBoard]);

  useEffect(() => {
    if (focusDuration === 0) return;
    // Enlarge the existing board before moving its pieces; keep their DOM identities.
    const move = window.setTimeout(() => {
      setAnimation((current) =>
        current.event === event && current.phase === 'before' ? { event, phase: 'move' } : current,
      );
    }, moveDelay);
    const reveal = window.setTimeout(
      () =>
        setAnimation((current) => (current.event === event ? { event, phase: 'story' } : current)),
      focusDuration,
    );
    return () => {
      window.clearTimeout(move);
      window.clearTimeout(reveal);
    };
  }, [event, focusDuration, moveDelay]);

  useEffect(() => {
    const passage = passageRef.current;
    const controls = passage?.closest('main')?.querySelector('footer');
    if (!passage || !controls) return;
    let frame = 0;
    function measure() {
      if (!passage || !controls) return;
      const text = passage.getBoundingClientRect();
      const readingBottom = Math.min(window.innerHeight, controls.getBoundingClientRect().top);
      // Hide the cue once the reader reaches the passage, even if a long passage needs scrolling.
      setShowReadingCue(text.top > 24 && text.bottom > readingBottom - 16);
    }
    function scheduleMeasurement() {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(measure);
    }
    const observer = new ResizeObserver(scheduleMeasurement);
    observer.observe(passage);
    observer.observe(controls);
    window.addEventListener('resize', scheduleMeasurement);
    window.addEventListener('scroll', scheduleMeasurement, { passive: true });
    scheduleMeasurement();
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', scheduleMeasurement);
      window.removeEventListener('scroll', scheduleMeasurement);
    };
  }, [event]);

  const storyControls = (
    <>
      {!isOpening && (
        <div className={styles.sceneTools}>
          <button
            type="button"
            onClick={() => {
              onPause();
              setHoldBoard(true);
            }}
          >
            Keep board large
          </button>
          <button type="button" onClick={onInspect}>
            Inspect full board
          </button>
        </div>
      )}
      <button
        type="button"
        className={shared.momentsTrigger}
        aria-haspopup="dialog"
        onClick={onOpenMoments}
      >
        <span>Jump to a story moment</span>
        <span aria-hidden="true">›</span>
      </button>
    </>
  );

  return (
    <article className={styles.overlay} aria-labelledby="story-heading" data-opening={isOpening}>
      <div className={styles.visual}>
        <div
          className={styles.stage}
          ref={stageRef}
          data-testid="overlay-stage"
          data-phase={showingStory ? 'story' : 'board'}
        >
          <figure className={styles.illustration} aria-hidden={!showingStory}>
            <SceneArt
              scene={event.scene}
              sizes="(max-width: 350px) 94vw, (max-width: 759px) 96vw, (max-width: 999px) 48vw, 75vw"
              priority
            />
          </figure>
          {!isOpening && (
            <div className={`${styles.boardLayer} ${shared.overlayBoard}`}>
              <div inert={showingStory || holdBoard}>
                <Board
                  event={event}
                  beforeMove={hasMove && animation.phase === 'before'}
                  animateMove={hasMove && animation.phase === 'move'}
                  onPiece={onPiece}
                />
              </div>
              {isPromotion && animation.phase !== 'story' && (
                <p className={styles.boardCaption} role="status">
                  {animation.phase === 'before'
                    ? 'Alice is a pawn on d8'
                    : 'Alice becomes a queen on d8'}
                </p>
              )}
              {(showingStory || holdBoard) && (
                <button
                  ref={boardControlRef}
                  type="button"
                  className={styles.enlargeBoard}
                  aria-label={holdBoard ? 'Return to story' : 'Enlarge chessboard'}
                  title={holdBoard ? 'Return to story (Escape)' : 'Enlarge chessboard'}
                  data-focused={holdBoard}
                  onClick={holdBoard ? () => setHoldBoard(false) : onInspect}
                >
                  {holdBoard && (
                    <span className={styles.returnToStory} aria-hidden="true">
                      Return to story <span>×</span>
                    </span>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
        {event.kind !== 'encounter' && event.kind !== 'palace' && (
          <p
            className={styles.sceneLabel}
            style={{ visibility: isPromotion && !showingStory ? 'hidden' : undefined }}
          >
            {event.label}
          </p>
        )}
        <div
          className={styles.desktopControls}
          style={{ visibility: showingStory ? 'visible' : 'hidden' }}
          inert={!showingStory}
        >
          {storyControls}
        </div>
      </div>
      <div
        id="story-passage"
        className={styles.passage}
        ref={passageRef}
        tabIndex={-1}
        style={{ visibility: showingStory ? 'visible' : 'hidden' }}
        aria-hidden={!showingStory}
        inert={!showingStory}
      >
        {children}
      </div>
      <details
        key={event.id}
        className={styles.mobileOptions}
        style={{ visibility: showingStory ? 'visible' : 'hidden' }}
        inert={!showingStory}
        onToggle={(event) => {
          if (event.currentTarget.open) onPause();
        }}
      >
        <summary>Story options</summary>
        {storyControls}
      </details>
      {showingStory && showReadingCue && (
        <button
          type="button"
          className={styles.readCue}
          aria-controls="story-passage"
          onClick={() => {
            onPause();
            passageRef.current?.focus({ preventScroll: true });
            passageRef.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
            setShowReadingCue(false);
          }}
        >
          Read the story below
        </button>
      )}
    </article>
  );
}
