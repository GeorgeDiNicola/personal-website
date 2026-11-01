import assert from "node:assert/strict";
import test from "node:test";

import { chessPuzzles, getPuzzlePosition } from "./chess-puzzles.ts";

test("all three puzzles are interactive and finish on the player's move", () => {
  assert.equal(chessPuzzles.length, 3);
  for (const puzzle of chessPuzzles) {
    assert.ok(puzzle.playerColor);
    assert.equal(puzzle.orientation, puzzle.playerColor);
    assert.equal(puzzle.fen.split(" ")[1], puzzle.playerColor === "white" ? "w" : "b");
    assert.equal(puzzle.solution.length % 2, 1);
  }
});

test("game citations open on the puzzle's first move", () => {
  for (const puzzle of chessPuzzles) {
    const gameUrl = new URL(puzzle.gameUrl);
    const [, sideToMove, , , , moveNumber] = puzzle.fen.split(" ");
    const moveIndex = (Number(moveNumber) - 1) * 2 + (sideToMove === "b" ? 1 : 0);
    assert.equal(gameUrl.origin, "https://www.chess.com");
    assert.match(gameUrl.pathname, /^\/a\/[A-Za-z0-9]+\/analysis$/);
    assert.equal(gameUrl.searchParams.get("move"), String(moveIndex));
  }
});

for (const puzzle of chessPuzzles) {
  test(`${puzzle.id}: every solution step can render and moves a piece of the correct color`, () => {
    const startsWithWhite = puzzle.fen.split(" ")[1] === "w";

    for (const [index, move] of puzzle.solution.entries()) {
      const pieces = getPuzzlePosition(puzzle, index);
      const movingPiece = pieces.find((piece) => piece.square === move.from);
      const whiteToMove = startsWithWhite === (index % 2 === 0);
      assert.ok(movingPiece, `Missing piece for ${move.notation}`);
      assert.equal(movingPiece.color, whiteToMove ? "white" : "black");
      const destination = pieces.find((piece) => piece.square === move.to);
      if (destination) assert.notEqual(destination.color, movingPiece.color);

      const nextPosition = getPuzzlePosition(puzzle, index + 1);
      assert.equal(new Set(nextPosition.map((piece) => piece.square)).size, nextPosition.length);
      assert.ok(nextPosition.some((piece) => piece.id === movingPiece.id && piece.square === move.to));
    }
  });
}

test("the second puzzle finishes when White captures the queen", () => {
  const puzzle = chessPuzzles[1];
  const initialPosition = getPuzzlePosition(puzzle, 0);
  assert.deepEqual(initialPosition.filter((piece) => piece.color === "black" && piece.type === "r").map((piece) => piece.square).sort(), ["b8", "e8"]);
  assert.equal(initialPosition.some((piece) => piece.square === "c3"), false);

  const finalPosition = getPuzzlePosition(puzzle, puzzle.solution.length);
  assert.ok(finalPosition.some((piece) => piece.color === "white" && piece.type === "q" && piece.square === "h6"));
  assert.equal(finalPosition.some((piece) => piece.color === "black" && piece.type === "q"), false);
  assert.equal(puzzle.solution.at(-1).to, "h6");
});
