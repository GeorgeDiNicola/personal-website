'use client';
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useMemo,
  type Dispatch,
  type ReactNode,
} from 'react';
import { usePathname } from 'next/navigation';
import {
  initialPlayback,
  openingNoteId,
  playbackMomentId,
  playbackReducer,
  readingTime,
  storyDestination,
  type PlaybackAction,
  type PlaybackState,
} from './playback';
import { story, storyMomentHref } from './story';
const Context = createContext<{
  state: PlaybackState;
  dispatch: Dispatch<ProviderAction>;
} | null>(null);
const progressStorageKey = 'looking-glass:story-position:v1';
const restartedMomentKey = 'lookingGlassRestartedMoment';
type ProviderAction = PlaybackAction | { type: 'restore'; eventId: string | null };
interface ProviderState {
  playback: PlaybackState;
  hasStarted: boolean;
}
const initialProviderState: ProviderState = {
  playback: initialPlayback,
  hasStarted: false,
};

function providerReducer(state: ProviderState, action: ProviderAction): ProviderState {
  if (action.type === 'restore') {
    if (state.hasStarted) return state;
    // The former starting-board stop now leads directly into the Queen’s meeting.
    const eventId = action.eventId === 'chessboard' ? 'red-queen-meeting' : action.eventId;
    const destination = eventId ? storyDestination(storyMomentHref(eventId)) : null;
    if (destination === null) return state;
    return {
      playback: playbackReducer(state.playback, { type: 'jump', destination }),
      hasStarted: true,
    };
  }
  const playback = playbackReducer(state.playback, action);
  const hasStarted =
    state.hasStarted || !playback.showDisclaimer || action.type === 'restart' || action.type === 'jump';
  return { playback, hasStarted };
}

/** One story clock that restores saved progress with autoplay paused. */
export function PlaybackProvider({ children }: { children: ReactNode }) {
  const [providerState, dispatch] = useReducer(providerReducer, initialProviderState);
  const { playback: state, hasStarted } = providerState;
  const momentId = playbackMomentId(state);
  const savedEventId = state.showDisclaimer ? null : momentId;
  const path = usePathname();
  useEffect(() => {
    function followMomentLink() {
      const destination = storyDestination(window.location.hash);
      if (destination === null) return false;
      dispatch({ type: 'jump', destination });
      return true;
    }
    function restoreRestartedEntry(event: PopStateEvent) {
      if (window.location.hash) return;
      const eventId = event.state?.[restartedMomentKey];
      if (eventId === null) {
        dispatch({ type: 'restart' });
      } else if (typeof eventId === 'string') {
        const destination = storyDestination(storyMomentHref(eventId));
        if (destination !== null) dispatch({ type: 'jump', destination });
      }
    }
    if (!followMomentLink()) {
      let eventId: string | null = null;
      try {
        eventId = window.localStorage.getItem(progressStorageKey);
      } catch {
        // Readers can still use the story when browser storage is unavailable.
      }
      dispatch({ type: 'restore', eventId });
    }
    window.addEventListener('hashchange', followMomentLink);
    window.addEventListener('popstate', restoreRestartedEntry);
    return () => {
      window.removeEventListener('hashchange', followMomentLink);
      window.removeEventListener('popstate', restoreRestartedEntry);
    };
  }, []);
  useEffect(() => {
    if (!hasStarted) return;
    const { pathname, search, hash } = window.location;
    const path = pathname + search;
    // Keep a linked page current without adding an extra history entry for each playback step.
    if (storyDestination(hash) !== null) {
      if (savedEventId === null && hash !== storyMomentHref(openingNoteId)) {
        window.history.replaceState({ [restartedMomentKey]: null }, '', path);
      } else {
        const moment = storyMomentHref(momentId);
        if (hash !== moment) window.history.replaceState(null, '', path + moment);
      }
      return;
    }
    // A restarted history entry has no fragment, but Back and Forward still need its position.
    const restartedMoment = window.history.state?.[restartedMomentKey];
    if (!hash && restartedMoment !== undefined && restartedMoment !== savedEventId) {
      window.history.replaceState({ [restartedMomentKey]: savedEventId }, '', path);
    }
  }, [hasStarted, momentId, savedEventId]);
  useEffect(() => {
    // Wait for restoration before writing so mounting cannot overwrite saved progress.
    if (!hasStarted) return;
    try {
      if (savedEventId === null) window.localStorage.removeItem(progressStorageKey);
      else window.localStorage.setItem(progressStorageKey, savedEventId);
    } catch {
      // Storage restrictions must not interrupt navigation or autoplay.
    }
  }, [hasStarted, savedEventId]);
  useEffect(() => {
    dispatch({ type: 'pause' });
  }, [path]);
  useEffect(() => {
    if (!state.playing) return;
    const timer = window.setTimeout(
      () => dispatch({ type: 'tick' }),
      readingTime(story[state.index], state.speed),
    );
    return () => window.clearTimeout(timer);
  }, [state.index, state.playing, state.speed]);
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) dispatch({ type: 'pause' });
    };
    const onKey = (event: KeyboardEvent) => {
      const target = event.target;
      if (
        event.defaultPrevented ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        document.querySelector('dialog[open]') ||
        (target instanceof HTMLElement &&
          (target.isContentEditable || target.closest('input, textarea, select, [role="tab"]')))
      )
        return;
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault();
        dispatch({ type: 'step', delta: event.key === 'ArrowRight' ? 1 : -1 });
      }
      if (event.code === 'Space') {
        // Preserve native Space activation on interactive elements.
        if (target instanceof HTMLElement && target.closest('button, a, summary')) return;
        event.preventDefault();
        dispatch({ type: 'toggle' });
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      document.removeEventListener('keydown', onKey);
    };
  }, []);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function usePlayback() {
  const context = useContext(Context);
  if (!context) throw new Error('The story requires PlaybackProvider.');
  return context;
}
