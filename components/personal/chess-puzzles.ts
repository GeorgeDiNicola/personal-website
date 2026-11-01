export type ChessPieceType = "k" | "q" | "r" | "b" | "n" | "p";
export type ChessColor = "white" | "black";

export type ChessPiece = {
  id: string;
  type: ChessPieceType;
  color: ChessColor;
  square: string;
};

export type PuzzleMove = {
  from: string;
  to: string;
  notation: string;
  promotion?: ChessPieceType;
  // These optional updates let authored solutions include en passant and castling.
  capturedSquare?: string;
  rookMove?: { from: string; to: string };
};

export type ChessPuzzle = {
  id: string;
  prompt: string;
  gameUrl: string;
  fen: string;
  orientation: ChessColor;
  solution: readonly PuzzleMove[];
  description?: string;
  playerColor?: ChessColor;
  isSample?: boolean;
};

// Playback follows the authored line; it does not calculate or validate chess moves.
export const chessPuzzles: readonly ChessPuzzle[] = [
  {
    id: "brilliant-rook-invasion",
    prompt: "Black to move · Find the best move",
    gameUrl: "https://www.chess.com/a/e7Fv4pVL8wcz/analysis?move=53",
    fen: "6k1/ppb2p1p/2pq1Bp1/3nr3/3P4/P6P/1PQ2PP1/R4RK1 b - - 0 27",
    orientation: "black",
    solution: [
      { from: "e5", to: "e2", notation: "Re2!" },
      { from: "f6", to: "e5", notation: "Be5" },
      { from: "e2", to: "c2", notation: "Rxc2" },
      { from: "e5", to: "d6", notation: "Bxd6" },
      { from: "c7", to: "d6", notation: "Bxd6" },
    ],
    description: "Re2! attacks White's queen from the second rank and threatens Qh2#.",
    playerColor: "black",
  },
  {
    id: "rook-sacrifice",
    prompt: "White to move · Find the best move",
    gameUrl: "https://www.chess.com/a/2mC9Xx8dt8wcz/analysis?move=62",
    // Position after 31...Kf6 from GeorgeDiNicola vs. jthmyers.
    fen: "1r2r3/p1p4p/1p1ppk1q/5pR1/5Q2/1R6/P1P2PPP/6K1 w - - 3 32",
    orientation: "white",
    solution: [
      { from: "g5", to: "f5", notation: "Rxf5+" },
      { from: "e6", to: "f5", notation: "exf5" },
      { from: "f4", to: "h6", notation: "Qxh6+" },
    ],
    description: "Rxf5+ clears the diagonal to Black's queen on h6.",
    playerColor: "white",
  },
  {
    id: "knight-sacrifice-king-hunt",
    prompt: "White to move · Find the best move",
    gameUrl: "https://www.chess.com/a/2KigEuj1Q8wcz/analysis?move=50",
    // Position after 25...a5 from GeorgeDiNicola vs. ramaalf.
    fen: "r1b2rk1/7p/2p1pnpQ/p5N1/5N2/1q6/5PPP/3R1RK1 w - - 0 26",
    orientation: "white",
    solution: [
      { from: "f4", to: "g6", notation: "Nxg6!" },
      { from: "h7", to: "g6", notation: "hxg6" },
      { from: "h6", to: "g6", notation: "Qxg6+" },
      { from: "g8", to: "h8", notation: "Kh8" },
      { from: "g5", to: "f7", notation: "Nf7+" },
      { from: "f8", to: "f7", notation: "Rxf7" },
      { from: "g6", to: "f7", notation: "Qxf7" },
      { from: "b3", to: "c3", notation: "Qc3" },
      { from: "d1", to: "d8", notation: "Rd8+" },
      { from: "f6", to: "g8", notation: "Ng8" },
      { from: "f7", to: "g8", notation: "Qxg8#" },
    ],
    description: "Nxg6! sacrifices a knight to break open Black's kingside.",
    playerColor: "white",
  },
];

/** Returns the board after a given number of moves in a curated solution line. */
export function getPuzzlePosition(puzzle: ChessPuzzle, moveCount: number): ChessPiece[] {
  const pieces: ChessPiece[] = [];
  const ranks = puzzle.fen.split(" ")[0].split("/");

  ranks.forEach((rank, rankIndex) => {
    let file = 0;
    for (const symbol of rank) {
      if (/^[1-8]$/.test(symbol)) {
        file += Number(symbol);
        continue;
      }
      const square = `${String.fromCharCode(97 + file)}${8 - rankIndex}`;
      pieces.push({
        id: square,
        type: symbol.toLowerCase() as ChessPieceType,
        color: symbol === symbol.toUpperCase() ? "white" : "black",
        square,
      });
      file += 1;
    }
  });

  for (const move of puzzle.solution.slice(0, moveCount)) {
    const piece = pieces.find((candidate) => candidate.square === move.from);
    if (!piece) throw new Error(`Missing piece on ${move.from} in puzzle ${puzzle.id}`);

    const capturedIndex = pieces.findIndex((candidate) => candidate.square === (move.capturedSquare ?? move.to));
    if (capturedIndex !== -1) pieces.splice(capturedIndex, 1);
    piece.square = move.to;
    if (move.promotion) piece.type = move.promotion;
    if (move.rookMove) {
      const rook = pieces.find((candidate) => candidate.square === move.rookMove?.from);
      if (!rook) throw new Error(`Missing castling rook in puzzle ${puzzle.id}`);
      rook.square = move.rookMove.to;
    }
  }

  return pieces;
}

/** Labels a solution ply with its chess move number and side to move. */
export function getPuzzleMoveLabel(puzzle: ChessPuzzle, moveIndex: number): string {
  const fenFields = puzzle.fen.split(" ");
  const firstMoveNumber = Number(fenFields[5]);
  const startsWithBlack = fenFields[1] === "b";
  const plyIndex = moveIndex + (startsWithBlack ? 1 : 0);
  const moveNumber = firstMoveNumber + Math.floor(plyIndex / 2);

  return `${moveNumber}${plyIndex % 2 === 0 ? "." : "..."}`;
}
