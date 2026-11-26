import type { ReactNode } from 'react';
import type { Piece } from './types';

// Piece silhouettes from George DiNicola's personal website puzzle board.
const shapes: Record<Piece['type'], ReactNode> = {
  pawn: (
    <>
      <circle cx="30" cy="17" r="7" />
      <path d="M24 25h12l-2 9 7 10H19l7-10z" />
    </>
  ),
  rook: (
    <>
      <path d="M17 10h7v6h12v-6h7v15H17zM22 25h16v12l5 7H17l5-7z" />
      <path d="M22 29h16" />
    </>
  ),
  knight: (
    <>
      <path d="M17 44c0-10 4-14 12-19l-10 3-5-5 8-10 8-2 2-6 7 9c8 6 8 15 5 30z" />
      <path d="m22 18 1 1M19 26l4-3M35 24c-5 5-7 10-7 15" />
    </>
  ),
  queen: (
    <>
      <path d="m15 17 7 6 8-11 8 11 7-6-7 17H22zM24 34h12l2 6 5 4H17l5-4z" />
      <circle cx="14" cy="14" r="3" />
      <circle cx="30" cy="9" r="3" />
      <circle cx="46" cy="14" r="3" />
      <path d="M23 29h14" />
    </>
  ),
  king: (
    <>
      <path d="M30 5v12M25 10h10" />
      <path d="M30 20c-12-11-24 1-12 13h24c12-12 0-24-12-13zM23 33h14l1 7 5 4H17l5-4z" />
      <path d="M30 20v8" />
    </>
  ),
};

/** The board button or character details supply the accessible name. */
export function PieceArt({ type, color }: Pick<Piece, 'type' | 'color'>) {
  const white = color === 'White';
  return (
    <svg
      viewBox="0 0 60 60"
      className="piece-art"
      aria-hidden="true"
      fill={white ? '#fffdf6' : '#943044'}
      stroke={white ? '#20251e' : '#3c1520'}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {shapes[type]}
      <path d="M18 44h24l3 6H15zM15 50h30v4H15z" />
    </svg>
  );
}
