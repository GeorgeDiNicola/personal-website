export type Square =
  `${'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h'}${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8}`;
export type PieceType = 'king' | 'queen' | 'knight' | 'rook' | 'pawn';
export type PieceId =
  | 'alice'
  | 'white-king'
  | 'white-queen'
  | 'white-knight'
  | 'white-rook'
  | 'red-king'
  | 'red-queen'
  | 'red-knight';
/** Stable identity survives promotion and capture; a captured piece has no square. */
export interface Piece {
  readonly id: PieceId;
  readonly name: string;
  readonly color: 'White' | 'Red';
  readonly type: PieceType;
  readonly square: Square | null;
}
export type BoardSnapshot = readonly Piece[];
export type SceneId =
  | 'mirror'
  | 'garden'
  | 'red-queen-run'
  | 'railway'
  | 'shawl'
  | 'white-queen-memory'
  | 'sheep'
  | 'river'
  | 'egg-shelf'
  | 'humpty'
  | 'queen-flight'
  | 'woodland'
  | 'knight-check'
  | 'forest'
  | 'knight-return'
  | 'arrival'
  | 'palace'
  | 'promotion'
  | 'feast-arrival'
  | 'feast'
  | 'capture';
export interface Scene {
  readonly mirrorIllustration?: boolean;
  readonly title: string;
  readonly landmark: string;
  readonly square: Square;
  readonly alt: string;
}
export interface Motion {
  readonly piece: PieceId;
  readonly from: Square;
  readonly to: Square;
  readonly captured?: PieceId;
  readonly via?: Square;
}
/** A source entry or a single move, with its illustrated scene and board position. */
export interface StoryEvent {
  readonly id: string;
  readonly turn: number;
  readonly kind: 'initial' | 'move' | 'capture' | 'encounter' | 'promotion' | 'palace';
  readonly title: string;
  readonly momentTitle?: string;
  readonly label: string;
  readonly scene: SceneId;
  readonly excerpt: string;
  readonly source: { readonly url: string; readonly locator: string };
  readonly chess: string;
  readonly story: string;
  readonly rule?: { readonly title: string; readonly text: string };
  readonly before: BoardSnapshot;
  readonly board: BoardSnapshot;
  readonly motion?: Motion;
}
