import { useId, useRef, useState } from "react";

import type { ChessColor, ChessPiece, ChessPieceType, PuzzleMove } from "./chess-puzzles";

const pieceNames: Record<ChessPieceType, string> = {
  k: "king", q: "queen", r: "rook", b: "bishop", n: "knight", p: "pawn",
};

type ChessPuzzleBoardProps = {
  pieces: readonly ChessPiece[];
  orientation: ChessColor;
  lastMove?: PuzzleMove;
  selectedSquare?: string | null;
  incorrectMove?: { from: string; to: string } | null;
  onSquareClick?: (square: string) => void;
  onSquareMove?: (from: string, to: string) => void;
  disabled?: boolean;
};

/** Displays a chess puzzle board with optional square selection. */
export function ChessPuzzleBoard({
  pieces,
  orientation,
  lastMove,
  selectedSquare,
  incorrectMove,
  onSquareClick,
  onSquareMove,
  disabled = false,
}: ChessPuzzleBoardProps) {
  const descriptionId = useId();
  const boardShellRef = useRef<HTMLDivElement>(null);
  const squareGridRef = useRef<HTMLDivElement>(null);
  const dragStartSquareRef = useRef<string | null>(null);
  const didDragRef = useRef(false);
  const [draggedSquare, setDraggedSquare] = useState<string | null>(null);
  const [dragPointer, setDragPointer] = useState<{ x: number; y: number } | null>(null);
  const files = orientation === "white" ? "abcdefgh" : "hgfedcba";
  const ranks = orientation === "white" ? "87654321" : "12345678";
  const squares = Array.from({ length: 64 }, (_, index) => {
    const file = index % 8;
    const rank = Math.floor(index / 8);
    return `${files[file]}${ranks[rank]}`;
  });
  const position = (square: string) => ({
    x: 40 + files.indexOf(square[0]) * 100,
    y: 40 + ranks.indexOf(square[1]) * 100,
  });
  const squareAtPointerPosition = (clientX: number, clientY: number): string | null => {
    const grid = squareGridRef.current;
    if (!grid) return null;

    const bounds = grid.getBoundingClientRect();
    const file = Math.floor((clientX - bounds.left) / (bounds.width / 8));
    const rank = Math.floor((clientY - bounds.top) / (bounds.height / 8));
    if (file < 0 || file > 7 || rank < 0 || rank > 7) return null;

    return `${files[file]}${ranks[rank]}`;
  };

  const updateDragPointer = (clientX: number, clientY: number) => {
    const board = boardShellRef.current;
    if (!board) return;

    const bounds = board.getBoundingClientRect();
    setDragPointer({
      x: ((clientX - bounds.left) / bounds.width) * 100,
      y: ((clientY - bounds.top) / bounds.height) * 100,
    });
  };

  const startDrag = (square: string, clientX: number, clientY: number) => {
    dragStartSquareRef.current = square;
    didDragRef.current = false;
    setDraggedSquare(square);
    updateDragPointer(clientX, clientY);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>, square: string) => {
    if (disabled || event.button !== 0) return;

    // Capture keeps the release event on the board when a drag leaves its bounds.
    event.currentTarget.setPointerCapture(event.pointerId);
    startDrag(square, event.clientX, event.clientY);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartSquareRef.current) updateDragPointer(event.clientX, event.clientY);
  };

  const completeDrag = (clientX: number, clientY: number) => {
    const from = dragStartSquareRef.current;
    const to = squareAtPointerPosition(clientX, clientY);

    dragStartSquareRef.current = null;
    setDraggedSquare(null);
    setDragPointer(null);
    if (!from) return;
    didDragRef.current = to !== from;
    if (!to || from === to) return;

    onSquareMove?.(from, to);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    completeDrag(event.clientX, event.clientY);
  };

  const handlePointerCancel = () => {
    dragStartSquareRef.current = null;
    setDraggedSquare(null);
    setDragPointer(null);
  };

  const handleSquareClick = (event: React.MouseEvent<HTMLButtonElement>, square: string) => {
    if (didDragRef.current) {
      didDragRef.current = false;
      // A drag can disable its source before the synthetic click arrives.
      if (event.detail > 0) return;
    }
    onSquareClick?.(square);
  };
  const draggedPiece = draggedSquare ? pieces.find((piece) => piece.square === draggedSquare) : undefined;

  return (
    <div ref={boardShellRef} className="chess-puzzle-board-shell">
      <svg viewBox="0 0 880 880" role="img" aria-label="Chess puzzle board" aria-describedby={descriptionId} className="chess-puzzle-board">
        <desc id={descriptionId}>
          {orientation === "white" ? "White" : "Black"} at the bottom. {pieces.map((piece) => `${piece.color} ${pieceNames[piece.type]} on ${piece.square}`).join("; ")}.
        </desc>
        <g aria-hidden="true">
          {squares.map((square, index) => {
            const file = index % 8;
            const rank = Math.floor(index / 8);
            const highlighted = square === lastMove?.from || square === lastMove?.to || square === selectedSquare || square === draggedSquare;
            const incorrect = square === incorrectMove?.from || square === incorrectMove?.to;
            return (
              <g key={square}>
                <rect x={40 + file * 100} y={40 + rank * 100} width="100" height="100" fill={(file + rank) % 2 === 0 ? "#eeeadb" : "#7c916a"} />
                {highlighted ? <rect x={40 + file * 100} y={40 + rank * 100} width="100" height="100" fill="#f5ce62" fillOpacity="0.55" /> : null}
                {incorrect ? <rect className="chess-puzzle-incorrect-square" x={46 + file * 100} y={46 + rank * 100} width="88" height="88" rx="4" fill="none" /> : null}
              </g>
            );
          })}
          {[...files].map((file, index) => <text key={file} x={90 + index * 100} y="867" className="chess-puzzle-coordinate">{file}</text>)}
          {[...ranks].map((rank, index) => <text key={rank} x="19" y={98 + index * 100} className="chess-puzzle-coordinate">{rank}</text>)}
          {pieces.map((piece) => {
            const { x, y } = position(piece.square);
            return (
              <g key={piece.id} className={`chess-puzzle-piece${piece.square === draggedSquare ? " is-dragged" : ""}`} style={{ transform: `translate(${x + 10}px, ${y + 10}px)` }}>
                <svg width="80" height="80" viewBox="0 0 60 60" overflow="visible">
                  <g fill={piece.color === "white" ? "#fffdf6" : "#30342d"} stroke="#20251e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <PieceShape type={piece.type} />
                  </g>
                </svg>
              </g>
            );
          })}
        </g>
      </svg>
      {draggedPiece && dragPointer ? (
        <div
          className="chess-puzzle-drag-preview"
          aria-hidden="true"
          style={{ left: `${dragPointer.x}%`, top: `${dragPointer.y}%` }}
        >
          <svg viewBox="0 0 60 60">
            <g fill={draggedPiece.color === "white" ? "#fffdf6" : "#30342d"} stroke="#20251e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <PieceShape type={draggedPiece.type} />
            </g>
          </svg>
        </div>
      ) : null}
      {onSquareClick || onSquareMove ? (
        <div
          ref={squareGridRef}
          className="chess-puzzle-square-grid"
          role="group"
          aria-label="Choose a chess square"
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          onLostPointerCapture={handlePointerCancel}
        >
          {squares.map((square) => (
            <button
              key={square}
              type="button"
              aria-label={`Select ${square}`}
              aria-pressed={square === selectedSquare}
              data-dragging={square === draggedSquare ? "true" : undefined}
              disabled={disabled}
              onPointerDown={(event) => handlePointerDown(event, square)}
              onClick={(event) => handleSquareClick(event, square)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function PieceShape({ type }: { type: ChessPieceType }) {
  return (
    <>
      {type === "p" ? <><circle cx="30" cy="17" r="7" /><path d="M24 25h12l-2 9 7 10H19l7-10z" /></> : null}
      {type === "r" ? <><path d="M17 10h7v6h12v-6h7v15H17zM22 25h16v12l5 7H17l5-7z" /><path d="M22 29h16" /></> : null}
      {type === "n" ? <><path d="M17 44c0-10 4-14 12-19l-10 3-5-5 8-10 8-2 2-6 7 9c8 6 8 15 5 30z" /><path d="m22 18 1 1M19 26l4-3M35 24c-5 5-7 10-7 15" /></> : null}
      {type === "b" ? <><circle cx="30" cy="8" r="3" /><path d="M30 11c-17 13-13 20 0 22 13-2 17-9 0-22zM26 33h8l3 6 6 5H17l6-5z" /><path d="m32 16-7 9" /></> : null}
      {type === "q" ? <><path d="m15 17 7 6 8-11 8 11 7-6-7 17H22zM24 34h12l2 6 5 4H17l5-4z" /><circle cx="14" cy="14" r="3" /><circle cx="30" cy="9" r="3" /><circle cx="46" cy="14" r="3" /><path d="M23 29h14" /></> : null}
      {type === "k" ? <><path d="M30 5v12M25 10h10" /><path d="M30 20c-12-11-24 1-12 13h24c12-12 0-24-12-13zM23 33h14l1 7 5 4H17l5-4z" /><path d="M30 20v8" /></> : null}
      <path d="M18 44h24l3 6H15zM15 50h30v4H15z" />
    </>
  );
}
