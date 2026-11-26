'use client';
import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
  type RefObject,
} from 'react';
import { Board } from './Board';
import { PieceArt } from './PieceArt';
import { StoryOverlay } from './StoryOverlay';
import { usePlayback } from './PlaybackProvider';
import { closingNoteId, openingNoteId, playbackMomentId, storyDestination } from './playback';
import { story, characterRole, storyMomentHref } from './story';
import type { Piece, StoryEvent } from './types';
import styles from './LookingGlass.module.css';

const storyOutline = [
  { id: openingNoteId, title: 'Opening note', detail: null },
  ...story.map((moment, index) => ({
    id: moment.id,
    title: moment.momentTitle ?? moment.title,
    detail: index === 0
      ? 'Beginning'
      : `Move ${index} · ${moment.kind === 'encounter' ? 'The board stays the same' : moment.label}`,
  })),
  { id: closingNoteId, title: 'A closing note', detail: null },
];

function Modal({
  children,
  title,
  onClose,
  fallbackFocus,
  className,
}: {
  children: ReactNode;
  title: string;
  onClose: () => void;
  fallbackFocus: RefObject<HTMLElement | null>;
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    const trigger = document.activeElement;
    const fallback = fallbackFocus.current;
    dialog?.showModal();
    return () => {
      dialog?.close();
      if (
        trigger instanceof HTMLElement &&
        trigger.isConnected &&
        trigger.getClientRects().length &&
        !trigger.closest('[inert]')
      ) {
        trigger.focus();
      } else {
        // A responsive layout can hide the control that opened the dialog.
        fallback?.focus({ preventScroll: true });
      }
    };
  }, [fallbackFocus]);
  return (
    <dialog
      ref={ref}
      className={className ? `${styles.dialog} ${className}` : styles.dialog}
      aria-label={title}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={styles.dialogContent}>
        <button className={styles.close} onClick={onClose} aria-label="Close dialog" autoFocus>
          Close ×
        </button>
        {children}
      </div>
    </dialog>
  );
}
/** The illustrated chess journey, with the board layered over each scene. */
export function Experience() {
  const { state, dispatch } = usePlayback();
  const event = story[state.index];
  const totalSteps = story.length - 1;
  const atCheckmate = state.index === totalSteps;
  const showNote = state.showDisclaimer || state.showClosingNote;
  const currentMomentId = playbackMomentId(state);
  const progress = state.index === 0 ? 'Beginning' : `Move ${state.index}/${totalSteps}`;
  const [dialog, setDialog] = useState<
    | { kind: 'character'; event: StoryEvent; piece: Piece }
    | { kind: 'inspect'; event: StoryEvent }
    | { kind: 'moments'; momentId: string }
    | null
  >(null);
  // Browser history and shared links can change the scene while a dialog is open.
  if (dialog && (dialog.kind === 'moments'
    ? dialog.momentId !== currentMomentId
    : dialog.event !== event || showNote)) setDialog(null);
  const showMoments = dialog?.kind === 'moments';
  const noteHeadingRef = useRef<HTMLHeadingElement>(null);
  const journeyRef = useRef<HTMLDivElement>(null);
  const momentListRef = useRef<HTMLElement>(null);
  const currentMomentRef = useRef<HTMLAnchorElement>(null);
  const focusAfterJump = useRef(false);
  const previousIndex = useRef(state.index);
  const note = state.showDisclaimer ? 'opening' : state.showClosingNote ? 'closing' : null;
  const previousNote = useRef(note);
  useEffect(() => {
    if (previousNote.current !== note) {
      const target = note ? noteHeadingRef : journeyRef;
      target.current?.focus({ preventScroll: true });
    }
    previousNote.current = note;
  }, [note]);
  useEffect(() => {
    if (previousIndex.current === state.index) return;
    previousIndex.current = state.index;
    const journey = journeyRef.current;
    // Readers reaching the end of a passage should see the next event from its beginning.
    if (journey && journey.getBoundingClientRect().top < 0) {
      journey.scrollIntoView({ block: 'start', behavior: 'instant' });
    }
  }, [state.index]);
  useEffect(() => {
    if (showMoments) {
      const list = momentListRef.current;
      const current = currentMomentRef.current;
      if (list && current) {
        const top = current.getBoundingClientRect().top - list.getBoundingClientRect().top;
        list.scrollTop += top - (list.clientHeight - current.offsetHeight) / 2;
      }
    } else if (focusAfterJump.current) {
      focusAfterJump.current = false;
      const target = showNote ? noteHeadingRef.current : journeyRef.current;
      target?.focus({ preventScroll: true });
      target?.scrollIntoView({ block: 'start', behavior: 'instant' });
    }
  }, [showMoments, currentMomentId, showNote]);
  function openMoments() {
    dispatch({ type: 'pause' });
    setDialog({ kind: 'moments', momentId: currentMomentId });
  }
  function selectMoment(click: MouseEvent<HTMLAnchorElement>) {
    if (click.button !== 0 || click.altKey || click.ctrlKey || click.metaKey || click.shiftKey)
      return;
    const destination = storyDestination(click.currentTarget.hash);
    if (destination === null) return;
    click.preventDefault();
    const currentLink = storyMomentHref(currentMomentId);
    // The browser's Back button should return to the scene the reader jumped from.
    if (window.location.hash !== currentLink) window.history.replaceState(null, '', currentLink);
    if (click.currentTarget.hash !== currentLink)
      window.history.pushState(null, '', click.currentTarget.href);
    dispatch({ type: 'jump', destination });
    focusAfterJump.current = true;
    setDialog(null);
  }
  function openPiece(piece: Piece) {
    dispatch({ type: 'pause' });
    setDialog({ kind: 'character', event, piece });
  }
  const noteOutlineButton = (
    <button type="button" className={styles.momentsTrigger} aria-haspopup="dialog" onClick={openMoments}>
      <span>Jump to a story moment</span>
      <span aria-hidden="true">›</span>
    </button>
  );
  return (
    <main id="main-content" className={styles.experience}>
      {state.showDisclaimer && (
        <section className={styles.noteOverlay} aria-labelledby="opening-title">
          <div className={styles.note}>
            <h1 id="opening-title" className={styles.openingTitle} ref={noteHeadingRef} tabIndex={-1}>
              Through the Looking-Glass{' '}
              <span className={styles.openingSubtitle}>Interactive Chess Story</span>
            </h1>
            <p>
              Follow Alice from pawn to queen as you play through Lewis Carroll’s original chess
              sequence, one illustrated scene at a time.
            </p>
            <h2 id="chess-note-heading">A note on the chess</h2>
            <p>
              Carroll’s game departs from ordinary chess in several ways: turns do not always
              alternate, a check goes unanswered, and Queens “castle.” These may be mistakes or
              deliberate touches that suit the odd logic of the Looking-Glass world.{' '}
              <cite className={styles.citation}>
                (
                <a
                  href="https://en.wikisource.org/wiki/Page:Through_the_looking-glass_and_what_Alice_found_there_(IA_throughlookinggl00carr4).pdf/29"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Carroll’s preface
                </a>
                )
              </cite>
            </p>
            <p>
              First published in 1871, <em>Through the Looking-Glass</em> has been in the public
              domain in the United States for more than 50 years.{' '}
              <cite className={styles.citation}>
                (
                <a
                  href="https://www.gutenberg.org/ebooks/12"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Project Gutenberg
                </a>
                )
              </cite>
            </p>
            <p className={styles.openingHint}>Select Next or Play to continue.</p>
            {noteOutlineButton}
          </div>
        </section>
      )}
      {state.showClosingNote && (
        <section className={styles.noteOverlay} aria-labelledby="story-note-heading">
          <div className={styles.note}>
            <h1 id="story-note-heading" ref={noteHeadingRef} tabIndex={-1}>
              A closing note
            </h1>
            <p>
              I want more readers to see what I love about Lewis Carroll’s
              idea of telling a story through a game of chess. Carroll gives us the whole game at
              the front of <em>Through the Looking-Glass</em>, and the notation can take some
              getting used to if you’re new to chess. I want readers to see each move on the board
              as it happens in Alice’s adventure.
            </p>
            <p>
              I’m excited about how technology and AI can make stories more immersive and
              open up new ways to experience and learn from familiar stories. Here, you can pause or
              replay a move and take time to see how it fits into Alice’s adventure.
            </p>
            <p className={styles.noteSignature}>George DiNicola</p>
            <p className={styles.noteLink}>
              <a
                href="https://en.wikisource.org/wiki/Page:Through_the_Looking-Glass,_and_What_Alice_Found_There.djvu/11"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Carroll’s original chess diagram and move list
              </a>
            </p>
            {noteOutlineButton}
          </div>
        </section>
      )}
      <div hidden={showNote}>
        <a
          href="#journey"
          className={styles.skip}
          onClick={(click) => {
            if (click.altKey || click.ctrlKey || click.metaKey || click.shiftKey) return;
            click.preventDefault();
            journeyRef.current?.focus({ preventScroll: true });
            journeyRef.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
          }}
        >
          Skip to the journey
        </a>
        <div id="journey" className={styles.journey} ref={journeyRef} tabIndex={-1}>
          {!showNote && (
            <StoryOverlay
              event={event}
              speed={state.speed}
              playing={state.playing}
              onPiece={openPiece}
              onPause={() => dispatch({ type: 'pause' })}
              onOpenMoments={openMoments}
              onInspect={() => {
                dispatch({ type: 'pause' });
                setDialog({ kind: 'inspect', event });
              }}
            >
              <div className={styles.prose}>
                <span className={styles.progress} data-testid="progress">
                  {progress}
                </span>
                <h1 id="story-heading">{event.title}</h1>
                <p data-testid="story-description">{event.story}</p>
                {atCheckmate && (
                  <button className={styles.restart} onClick={() => dispatch({ type: 'restart' })}>
                    Return to the mirror ↺
                  </button>
                )}
              </div>
            </StoryOverlay>
          )}
        </div>
        <div className={styles.live} aria-live="polite" aria-atomic="true">
          {state.index === 0 ? 'Invitation.' : `Move ${state.index} of ${totalSteps}.`}{' '}
          {event.momentTitle ?? event.title}{' '}
          {state.index > 0 && event.kind !== 'encounter' && event.kind !== 'palace' && event.label}
        </div>
      </div>
      <footer
        className={`${styles.controls} ${showNote ? styles.noteControls : ''}`}
        aria-label="Story playback"
      >
        <div className={styles.progressTrack} hidden={showNote}>
          <div style={{ width: `${(state.index / totalSteps) * 100}%` }} />
        </div>
        <div className={styles.controlsInner}>
          <div className={styles.transport}>
            {!state.showDisclaimer && (
              <button
                onClick={() => dispatch({ type: 'step', delta: -1 })}
                aria-label="Back one step"
              >
                <span aria-hidden="true">←</span>
                <span className={state.showClosingNote ? undefined : styles.controlWord}>Back</span>
              </button>
            )}
            {!state.showClosingNote && (
              <>
                {!atCheckmate && (
                  <button
                    className={styles.play}
                    onClick={() => dispatch({ type: 'toggle' })}
                    aria-label={state.playing ? 'Pause autoplay' : 'Play story'}
                  >
                    <span aria-hidden="true">{state.playing ? 'Ⅱ' : '▶'}</span>
                    <span>{state.playing ? 'Pause' : 'Play'}</span>
                  </button>
                )}
                <button
                  onClick={() => dispatch({ type: 'step', delta: 1 })}
                  aria-label={state.showDisclaimer || atCheckmate ? undefined : 'Forward one step'}
                >
                  <span className={showNote || atCheckmate ? undefined : styles.controlWord}>
                    {state.showDisclaimer ? 'Next' : atCheckmate ? 'Closing note' : 'Forward'}
                  </span>
                  <span aria-hidden="true">→</span>
                </button>
              </>
            )}
            {!state.showDisclaimer && (
              <button
                onClick={() => dispatch({ type: 'restart' })}
                aria-label="Restart story"
                title="Restart story"
              >
                <span aria-hidden="true">↺</span>
                <span className={state.showClosingNote ? undefined : styles.controlWord}>
                  Restart
                </span>
              </button>
            )}
          </div>
          {!showNote && !atCheckmate && (
            <label className={styles.speed}>
              Speed up
              <select
                aria-label="Playback speed"
                title="Choose a higher speed for faster playback"
                value={state.speed}
                onChange={(e) => dispatch({ type: 'speed', speed: Number(e.target.value) })}
              >
                <option value={0.75}>0.75×</option>
                <option value={1}>1×</option>
                <option value={1.5}>1.5×</option>
                <option value={2}>2×</option>
              </select>
            </label>
          )}
        </div>
      </footer>
      {dialog?.kind === 'character' && (
        <Modal
          title={`${dialog.piece.name} character details`}
          onClose={() => setDialog(null)}
          fallbackFocus={journeyRef}
        >
          <div className={styles.characterArt}>
            <PieceArt color={dialog.piece.color} type={dialog.piece.type} />
          </div>
          <p className={styles.eyebrow}>
            {dialog.piece.color} {dialog.piece.type} · {dialog.piece.square}
          </p>
          <h2>{dialog.piece.name}</h2>
          <p>{characterRole(dialog.piece, event)}</p>
          <p className={styles.editorialNote}>At this moment · {event.title}</p>
        </Modal>
      )}
      {dialog?.kind === 'inspect' && (
        <Modal
          title="Full board inspection"
          onClose={() => setDialog(null)}
          fallbackFocus={journeyRef}
        >
          <Board event={event} onPiece={openPiece} />
        </Modal>
      )}
      {showMoments && (
        <Modal
          title="Story moments"
          onClose={() => setDialog(null)}
          fallbackFocus={showNote ? noteHeadingRef : journeyRef}
          className={styles.momentsDialog}
        >
          <h2 className={styles.momentsHeading}>Story moments</h2>
          <p className={styles.momentsIntro}>Choose a moment to jump to that part of the story.</p>
          <nav
            className={styles.momentsNav}
            aria-label="Story moments in order"
            ref={momentListRef}
          >
            <ol className={styles.momentsList} role="list">
              {storyOutline.map((moment) => {
                const isCurrent = moment.id === currentMomentId;
                return (
                  <li key={moment.id}>
                    <a
                      href={storyMomentHref(moment.id)}
                      aria-current={isCurrent ? 'step' : undefined}
                      ref={isCurrent ? currentMomentRef : undefined}
                      onClick={selectMoment}
                    >
                      <span>
                        <span className={styles.momentTitle}>{moment.title}</span>
                        {moment.detail && <span className={styles.momentDetail}>{moment.detail}</span>}
                      </span>
                      {isCurrent && <span className={styles.currentMoment}>You’re here</span>}
                      {!isCurrent && (
                        <span className={styles.momentArrow} aria-hidden="true">
                          ›
                        </span>
                      )}
                    </a>
                  </li>
                );
              })}
            </ol>
          </nav>
        </Modal>
      )}
    </main>
  );
}
