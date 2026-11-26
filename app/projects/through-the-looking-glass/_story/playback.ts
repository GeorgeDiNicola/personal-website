import { story, storyMomentHref, storyMomentIndex } from './story';
import type { StoryEvent } from './types';
export interface PlaybackState {
  readonly showDisclaimer: boolean;
  readonly showClosingNote: boolean;
  readonly index: number;
  readonly playing: boolean;
  readonly speed: number;
}
export const openingNoteId = 'opening-note';
export const closingNoteId = 'closing-note';
type StoryDestination = number | typeof openingNoteId | typeof closingNoteId;

export function storyDestination(hash: string): StoryDestination | null {
  if (hash === storyMomentHref(openingNoteId)) return openingNoteId;
  if (hash === storyMomentHref(closingNoteId)) return closingNoteId;
  const index = storyMomentIndex(hash);
  return index < 0 ? null : index;
}

export function playbackMomentId(state: PlaybackState): string {
  if (state.showDisclaimer) return openingNoteId;
  if (state.showClosingNote) return closingNoteId;
  return story[state.index].id;
}

export type PlaybackAction =
  | { type: 'step'; delta: number }
  | { type: 'jump'; destination: StoryDestination }
  | { type: 'toggle' }
  | { type: 'pause' }
  | { type: 'tick' }
  | { type: 'speed'; speed: number }
  | { type: 'dismiss-disclaimer' }
  | { type: 'restart' };
export const initialPlayback: PlaybackState = {
  showDisclaimer: true,
  showClosingNote: false,
  index: 0,
  playing: false,
  speed: 1,
};
/** User navigation pauses playback; a tick may never run past the final event. */
export function playbackReducer(state: PlaybackState, action: PlaybackAction): PlaybackState {
  const end = story.length - 1;
  switch (action.type) {
    case 'step':
      if (state.showDisclaimer) {
        return action.delta > 0 ? { ...state, showDisclaimer: false } : state;
      }
      if (state.showClosingNote) {
        return action.delta < 0 ? { ...state, showClosingNote: false } : state;
      }
      if (state.index === 0 && action.delta < 0) {
        return { ...state, showDisclaimer: true, playing: false };
      }
      if (state.index === end && action.delta > 0) {
        return { ...state, showClosingNote: true, playing: false };
      }
      return {
        ...state,
        index: Math.max(0, Math.min(end, state.index + action.delta)),
        playing: false,
      };
    case 'jump': {
      const { destination } = action;
      if (destination === openingNoteId) return { ...initialPlayback, speed: state.speed };
      if (destination === closingNoteId) {
        return { ...state, index: end, showDisclaimer: false, showClosingNote: true, playing: false };
      }
      return story[destination]
        ? {
            ...state,
            index: destination,
            showDisclaimer: false,
            showClosingNote: false,
            playing: false,
          }
        : state;
    }
    case 'toggle':
      return {
        ...state,
        showDisclaimer: false,
        playing: state.index < end && !state.playing,
      };
    case 'pause':
      return state.playing ? { ...state, playing: false } : state;
    case 'tick': {
      if (!state.playing) return state;
      const index = Math.min(end, state.index + 1);
      return { ...state, index, playing: index < end };
    }
    case 'speed':
      return { ...state, speed: action.speed };
    case 'dismiss-disclaimer':
      return state.showDisclaimer ? { ...state, showDisclaimer: false } : state;
    case 'restart':
      return { ...initialPlayback, speed: state.speed };
  }
}
export const boardSettleTime = 700;
export const promotionPawnTime = 1450;
export const promotionTransformTime = 1300;
const promotionQueenTime = 1300;

/** Time the board has the foreground before the passage appears. */
export function boardFocusTime(event: StoryEvent, speed: number): number {
  // Alice joins the seated Queens, so the feast illustration opens immediately.
  if (event.kind === 'initial' || event.id === 'alice-palace') return 0;
  // Leave time to recognize both silhouettes even at the fastest playback setting.
  if (event.kind === 'promotion') {
    return promotionPawnTime + promotionTransformTime + promotionQueenTime;
  }
  return boardSettleTime + 1400 / speed + 500;
}

/** Give the passage its reading time after the board has revealed it. */
export function readingTime(event: StoryEvent, speed: number): number {
  const text = `${event.title} ${event.story}`;
  return (
    boardFocusTime(event, speed) + Math.max(6000, text.trim().split(/\s+/).length * 250) / speed
  );
}
