'use client';
import { useId, type CSSProperties } from 'react';
import { PieceArt } from './PieceArt';
import { promotionTransformTime } from './playback';
import { displayedPosition, story } from './story';
import type { Piece, Square, StoryEvent } from './types';
import styles from './LookingGlass.module.css';
export const files = 'abcdefgh';
const checkedSquares: Readonly<Record<string, Square>> = {
  'knight-check': 'c6',
  examination: 'c6',
  promotion: 'c6',
  'queens-palace': 'c6',
  'alice-palace': 'c6',
  soup: 'c6',
  checkmate: 'e4',
};
function point(square: Square) {
  return { x: files.indexOf(square[0]), y: 8 - Number(square[1]) };
}
export function Board({
  event,
  beforeMove = false,
  animateMove = false,
  onPiece,
}: {
  event: StoryEvent;
  beforeMove?: boolean;
  animateMove?: boolean;
  onPiece: (piece: Piece, trigger: HTMLButtonElement) => void;
}) {
  const arrowId = useId();
  const position = displayedPosition(event, beforeMove);
  const positionEvent = beforeMove ? story[story.indexOf(event) - 1] : event;
  const checked = positionEvent && checkedSquares[positionEvent.id];
  const motion = beforeMove ? undefined : event.motion;
  const promotion =
    event.kind === 'promotion' ? position.find((piece) => piece.id === 'alice') : undefined;
  return (
    <div className={styles.boardFrame} data-board={event.id} data-checked-square={checked}>
      <div
        className={animateMove ? `${styles.board} ${styles.animatePieces}` : styles.board}
        role="group"
        aria-label={`Chessboard, White at bottom. ${beforeMove ? 'Position before the move' : event.kind === 'encounter' || event.kind === 'palace' ? (event.momentTitle ?? event.title) : event.label}`}
      >
        <div className={styles.squares} aria-hidden="true">
          {Array.from({ length: 64 }, (_, i) => {
            const row = Math.floor(i / 8);
            const col = i % 8;
            const square = `${files[col]}${8 - row}`;
            return (
              <div
                key={square}
                className={`${styles.square} ${(row + col) % 2 ? styles.dark : styles.light} ${square === motion?.from ? styles.origin : ''} ${square === motion?.to ? styles.destination : ''} ${square === checked ? styles.check : ''} ${square === promotion?.square ? styles.promotionSquare : ''}`}
              >
                {col === 0 && <span className={styles.rank}>{8 - row}</span>}
                {row === 7 && <span className={styles.file}>{files[col]}</span>}
              </div>
            );
          })}
        </div>
        {motion && (
          <svg
            className={styles.motion}
            viewBox="0 0 8 8"
            aria-hidden="true"
            data-move-arrow={`${motion.from}-${motion.to}`}
          >
            <defs>
              <marker
                id={arrowId}
                markerWidth="3"
                markerHeight="3"
                refX="1.8"
                refY="1.5"
                orient="auto"
              >
                <path d="M0 0 2 1.5 0 3" fill="none" stroke="currentColor" strokeWidth=".5" />
              </marker>
            </defs>
            <path
              d={`M${point(motion.from).x + 0.5} ${point(motion.from).y + 0.5} L${point(motion.to).x + 0.5} ${point(motion.to).y + 0.5}`}
              stroke="currentColor"
              strokeWidth=".07"
              strokeDasharray=".12 .12"
              fill="none"
              markerEnd={`url(#${arrowId})`}
            />
          </svg>
        )}
        {position
          .filter((piece) => piece.square)
          .map((piece) => {
            const position = point(piece.square!);
            const transforming = piece === promotion && !beforeMove && animateMove;
            return (
              <button
                key={piece.id}
                type="button"
                className={`${styles.piece} ${piece.id === 'alice' ? styles.alice : ''} ${transforming ? styles.transformingAlice : ''}`}
                style={
                  {
                    '--x': position.x,
                    '--y': position.y,
                    '--promotion-duration': transforming
                      ? `${promotionTransformTime}ms`
                      : undefined,
                  } as CSSProperties
                }
                aria-label={`${piece.name}, ${piece.color} ${piece.type}, ${piece.square}.${piece.square === checked ? ' In check.' : ''} Character details`}
                onClick={(e) => onPiece(piece, e.currentTarget)}
                data-piece={piece.id}
                data-square={piece.square}
                data-type={piece.type}
              >
                <PieceArt type={piece.type} color={piece.color} />
                {transforming && (
                  <span className={styles.promotionPawn} aria-hidden="true">
                    <PieceArt type="pawn" color={piece.color} />
                  </span>
                )}
                {piece.id === 'alice' && <span className={styles.aliceDot}>A</span>}
              </button>
            );
          })}
      </div>
    </div>
  );
}
