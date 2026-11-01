"use client";

import { useEffect, useState } from "react";

import { CarouselControls } from "./CarouselControls";
import { SectionCard } from "./SectionCard";
import { ChessPuzzleBoard } from "./ChessPuzzleBoard";
import { chessPuzzles, getPuzzleMoveLabel, getPuzzlePosition, type ChessPuzzle } from "./chess-puzzles";

/** Browses locally authored chess puzzles and plays each solution one move at a time. */
export function ChessPuzzlesSection({ isDark }: { isDark: boolean }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const puzzle = chessPuzzles[activeIndex];

  const goToPreviousPuzzle = () => {
    setActiveIndex((index) => (index - 1 + chessPuzzles.length) % chessPuzzles.length);
  };

  const goToNextPuzzle = () => {
    setActiveIndex((index) => (index + 1) % chessPuzzles.length);
  };

  return (
    <SectionCard
      id="my-chess-puzzles"
      title="Chess puzzles I've created from my games"
      isDark={isDark}
    >
      {puzzle ? (
        <div className="chess-puzzle-workspace personal-carousel">
          <CarouselControls
            itemName="Puzzle"
            activeIndex={activeIndex}
            totalItems={chessPuzzles.length}
            onPrevious={goToPreviousPuzzle}
            onNext={goToNextPuzzle}
          />
          <nav className="chess-puzzle-picker" aria-label="Choose a chess puzzle">
            {chessPuzzles.map((item, index) => (
              <button
                key={item.id}
                type="button"
                aria-label={`View chess puzzle ${index + 1}`}
                aria-pressed={index === activeIndex}
                onClick={() => setActiveIndex(index)}
                className="chess-puzzle-choice"
              >
                <span className="chess-puzzle-number">{index + 1}</span>
              </button>
            ))}
          </nav>
          <PuzzlePlayer key={puzzle.id} puzzle={puzzle} />
        </div>
      ) : <p className="portfolio-copy">Puzzles coming soon.</p>}
    </SectionCard>
  );
}

function PuzzlePlayer({ puzzle }: { puzzle: ChessPuzzle }) {
  const [moveCount, setMoveCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShowingSolution, setIsShowingSolution] = useState(false);
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [incorrectMove, setIncorrectMove] = useState<{ from: string; to: string } | null>(null);
  const [attemptState, setAttemptState] = useState<"idle" | "incorrect" | "correct">("idle");
  const finished = moveCount === puzzle.solution.length;
  const lastMove = puzzle.solution[moveCount - 1];
  const pieces = getPuzzlePosition(puzzle, moveCount);
  const sideToMove = getSideToMove(puzzle, moveCount);
  const playerColor = puzzle.playerColor;
  const isInteractivePuzzle = playerColor !== undefined;
  const playerTurn = playerColor !== undefined && sideToMove === playerColor && !finished;
  let status = "Take your time. Find your move before revealing the solution.";
  if (playerColor) status = `${capitalize(playerColor)} to move. Drag a piece to its destination.`;
  if (selectedSquare) status = `Selected ${selectedSquare}. Choose a destination.`;
  if (attemptState === "incorrect") status = "Not quite — take another look and try again.";
  if (isShowingSolution) status = `Showing solution. Move ${moveCount} of ${puzzle.solution.length}.`;
  else if (isPlaying && isInteractivePuzzle) {
    status = attemptState === "correct"
      ? `Correct. ${capitalize(sideToMove)} is responding.`
      : `${capitalize(sideToMove)} is responding.`;
  } else if (isPlaying) status = `Playing solution. Move ${moveCount} of ${puzzle.solution.length}.`;
  else if (finished) status = "Solution complete.";
  else if (!isInteractivePuzzle && moveCount > 0) status = `Paused at move ${moveCount} of ${puzzle.solution.length}.`;

  useEffect(() => {
    if (!isPlaying) return;
    // One timeout per move leaves time to read each position and cancels on navigation.
    const timer = window.setTimeout(() => {
      const nextMoveCount = moveCount + 1;
      setMoveCount(nextMoveCount);
      if (isShowingSolution && nextMoveCount < puzzle.solution.length) return;

      if (isShowingSolution || isInteractivePuzzle || nextMoveCount >= puzzle.solution.length) {
        setIsPlaying(false);
        setIsShowingSolution(false);
        setAttemptState("idle");
      }
    }, isShowingSolution ? 1200 : 1100);
    return () => window.clearTimeout(timer);
  }, [isInteractivePuzzle, isPlaying, isShowingSolution, moveCount, puzzle.solution.length]);

  const togglePlayback = () => {
    if (finished) {
      setMoveCount(0);
      setSelectedSquare(null);
      setIncorrectMove(null);
      setAttemptState("idle");
      setIsShowingSolution(false);
      setIsPlaying(true);
      return;
    }
    setSelectedSquare(null);
    setIncorrectMove(null);
    setAttemptState("idle");
    setIsShowingSolution(false);
    setIsPlaying((playing) => !playing);
  };

  const goToMove = (count: number) => {
    setIsPlaying(false);
    setIsShowingSolution(false);
    setMoveCount(count);
    setSelectedSquare(null);
    setIncorrectMove(null);
    setAttemptState("idle");
  };

  const submitMove = (from: string, to: string) => {
    if (playerColor === undefined || !playerTurn || isPlaying || finished) return;

    const expectedMove = puzzle.solution[moveCount];
    const isCorrectMove = expectedMove !== undefined && from === expectedMove.from && to === expectedMove.to;
    setSelectedSquare(null);

    if (!isCorrectMove) {
      setIncorrectMove({ from, to });
      setAttemptState("incorrect");
      return;
    }

    setIncorrectMove(null);
    setAttemptState("correct");
    const nextMoveCount = moveCount + 1;
    setMoveCount(nextMoveCount);
    setIsShowingSolution(false);
    setIsPlaying(nextMoveCount < puzzle.solution.length && getSideToMove(puzzle, nextMoveCount) !== playerColor);
  };

  const showSolution = () => {
    setMoveCount(0);
    setSelectedSquare(null);
    setIncorrectMove(null);
    setAttemptState("idle");
    setIsShowingSolution(true);
    setIsPlaying(true);
  };

  const handleSquareClick = (square: string) => {
    if (!playerTurn || isPlaying || finished) return;

    if (square === selectedSquare) {
      setSelectedSquare(null);
      setIncorrectMove(null);
      setAttemptState("idle");
      return;
    }

    const piece = pieces.find((candidate) => candidate.square === square);
    if (piece?.color === playerColor) {
      setSelectedSquare(square);
      setIncorrectMove(null);
      setAttemptState("idle");
      return;
    }

    if (selectedSquare) submitMove(selectedSquare, square);
  };

  return (
    <div className="chess-puzzle-player">
      <div className="chess-puzzle-board-frame">
        <ChessPuzzleBoard
          pieces={pieces}
          orientation={puzzle.orientation}
          lastMove={lastMove}
          selectedSquare={selectedSquare}
          incorrectMove={incorrectMove}
          onSquareClick={isInteractivePuzzle ? handleSquareClick : undefined}
          onSquareMove={isInteractivePuzzle ? submitMove : undefined}
          disabled={isPlaying || !playerTurn}
        />
      </div>
      <div className="chess-puzzle-details">
        <div>
          <p className="chess-puzzle-turn site-text-static">
            {!finished ? <span className={`chess-puzzle-side chess-puzzle-side-${sideToMove}`} aria-hidden="true" /> : null}
            {finished ? "Puzzle complete" : `${capitalize(sideToMove)} to move`}
          </p>
          <p className="chess-puzzle-prompt portfolio-copy">{puzzle.prompt.split(" · ").slice(1).join(" · ") || puzzle.prompt}</p>
          {puzzle.description && moveCount > 0 ? <p className="chess-puzzle-description portfolio-copy">{puzzle.description}</p> : null}
          {puzzle.isSample ? (
            <p className="chess-puzzle-sample">Sample position — puzzles from my own games are on the way.</p>
          ) : null}
        </div>
        <div className="chess-puzzle-solution">
          <h4>{isInteractivePuzzle ? "Your moves" : "Solution"}</h4>
          {isInteractivePuzzle ? (
            <div className="chess-puzzle-controls">
              <button type="button" onClick={showSolution} disabled={isShowingSolution} className="chess-puzzle-play">
                <svg aria-hidden="true" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M4 2.5v11L13 8z" />
                </svg>
                {isShowingSolution ? "Showing solution" : finished ? "Replay solution" : "Show solution"}
              </button>
            </div>
          ) : (
            <div className="chess-puzzle-controls">
              <button type="button" onClick={togglePlayback} disabled={puzzle.solution.length === 0} className="chess-puzzle-play">
                <svg aria-hidden="true" viewBox="0 0 16 16" fill="currentColor">
                  {isPlaying ? <path d="M3 3h4v10H3zm6 0h4v10H9z" /> : <path d="M4 2.5v11L13 8z" />}
                </svg>
                {isPlaying ? "Pause" : finished ? "Replay" : moveCount > 0 ? "Continue" : "Show solution"}
              </button>
              <div className="chess-puzzle-step-controls">
                <button type="button" aria-label="Previous solution move" onClick={() => goToMove(moveCount - 1)} disabled={moveCount === 0}>
                  <Arrow direction="left" />
                </button>
                <button type="button" aria-label="Next solution move" onClick={() => goToMove(moveCount + 1)} disabled={finished}>
                  <Arrow direction="right" />
                </button>
              </div>
            </div>
          )}
          <button type="button" className="chess-puzzle-reset" onClick={() => goToMove(0)} disabled={moveCount === 0 && !isPlaying && attemptState === "idle" && selectedSquare === null}>Reset position</button>
          <p className="chess-puzzle-status site-text-static" role="status" aria-live="polite" aria-atomic="true">{status}</p>
          {moveCount > 0 ? (
            <ol className="chess-puzzle-moves site-text-static" role="list" aria-label="Revealed solution moves">
              {puzzle.solution.slice(0, moveCount).map((move, index) => (
                <li key={index} aria-current={index === moveCount - 1 ? "step" : undefined}>
                  <span>{getPuzzleMoveLabel(puzzle, index)}</span> {move.notation}
                </li>
              ))}
            </ol>
          ) : null}
        </div>
      </div>
      <a href={puzzle.gameUrl} target="_blank" rel="noopener noreferrer" className="chess-puzzle-source portfolio-action">
        View on Chess.com <span aria-hidden="true">↗</span>
      </a>
    </div>
  );
}

function Arrow({ direction }: { direction: "left" | "right" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d={direction === "left" ? "m10 3.5-4.5 4.5 4.5 4.5" : "m6 3.5 4.5 4.5-4.5 4.5"} />
    </svg>
  );
}

function getSideToMove(puzzle: ChessPuzzle, moveCount: number): "white" | "black" {
  const startsWithBlack = puzzle.fen.split(" ")[1] === "b";
  const blackToMove = startsWithBlack ? moveCount % 2 === 0 : moveCount % 2 !== 0;
  return blackToMove ? "black" : "white";
}

function capitalize(value: string): string {
  return `${value[0].toUpperCase()}${value.slice(1)}`;
}
