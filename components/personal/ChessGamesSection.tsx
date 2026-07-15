"use client";

import { useEffect, useState } from "react";

import { SectionCard } from "@/components/personal/SectionCard";

const chessGamesEmbedIds = [
  "14648777",
  "14648709",
  "14648717",
  "14648731",
  "14648747",
  "14648753",
  "14648757",
  "14648763",
  "14648769",
  "14648773",
  "14648929",
  "14648725",
  "14648713"
];

type ChessGamesSectionProps = {
  isDark: boolean;
};

export function ChessGamesSection({ isDark }: ChessGamesSectionProps) {
  const [activeGameIndex, setActiveGameIndex] = useState(0);
  const [lockedEmbedHeight, setLockedEmbedHeight] = useState<number | null>(null);
  const totalGames = chessGamesEmbedIds.length;
  const activeGameId = chessGamesEmbedIds[activeGameIndex] ?? "";
  const activeEmbedHeight = lockedEmbedHeight ?? 560;
  const activeGameUrl = activeGameId
    ? `https://www.chess.com/emboard?move=5&id=${encodeURIComponent(activeGameId)}&theme=${
        isDark ? "dark" : "light"
      }`
    : "";

  useEffect(() => {
    if (!totalGames) return;

    const onMessage = (event: MessageEvent) => {
      if (!event.origin.includes("chess.com")) return;

      const data = event.data as { id?: string; frameHeight?: number };
      const { id, frameHeight } = data;
      if (!id || typeof frameHeight !== "number") return;
      if (!chessGamesEmbedIds.includes(id)) return;

      const measuredHeight = frameHeight + 37;
      setLockedEmbedHeight((current) => current ?? measuredHeight);
    };

    window.addEventListener("message", onMessage);
    // remove the listener to prevent memory leaks
    return () => window.removeEventListener("message", onMessage);
  }, [totalGames]);

  const goToPreviousGame = () => {
    if (!totalGames) return;
    setActiveGameIndex((index) => (index - 1 + totalGames) % totalGames);
  };

  const goToNextGame = () => {
    if (!totalGames) return;
    setActiveGameIndex((index) => (index + 1) % totalGames);
  };

  return (
    <SectionCard
      id="best-chess-games"
      title="Featured 10-Minute Games on Chess.com"
      subtitle="Browse one game at a time using the carousel controls"
      isDark={isDark}
    >
      {activeGameUrl ? (
        <div className="space-y-5">
          <div className="flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
            <p className="portfolio-panel-label site-text-static">
              Game {activeGameIndex + 1} of {totalGames}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goToPreviousGame}
                aria-label="Previous game"
                title="Previous game"
                className="portfolio-control inline-flex h-9 w-9 items-center justify-center rounded-full"
              >
                <ChevronLeftIcon />
              </button>
              <button
                type="button"
                onClick={goToNextGame}
                aria-label="Next game"
                title="Next game"
                className="portfolio-control inline-flex h-9 w-9 items-center justify-center rounded-full"
              >
                <ChevronRightIcon />
              </button>
            </div>
          </div>

          <div className="portfolio-card chess-frame mx-auto w-full max-w-[880px] p-2 md:p-3">
            <div className="portfolio-inset overflow-hidden">
              <iframe
                id={activeGameId}
                title={`Chess game ${activeGameIndex + 1}`}
                src={activeGameUrl}
                className="mx-auto block w-full max-w-[760px]"
                style={{
                  height: `${activeEmbedHeight}px`,
                  border: "none",
                  backgroundColor: isDark ? "#020617" : "#ffffff"
                }}
                loading="lazy"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {chessGamesEmbedIds.map((id, index) => (
              <button
                key={id}
                type="button"
                aria-label={`View chess game ${index + 1}`}
                onClick={() => setActiveGameIndex(index)}
                className={`h-2.5 w-7 rounded-full transition-all duration-200 ${
                  index === activeGameIndex
                    ? isDark
                      ? "bg-cyan-300 shadow-[0_0_14px_rgba(103,232,249,0.45)]"
                      : "bg-cyan-700 shadow-[0_0_12px_rgba(14,116,144,0.25)]"
                    : isDark
                      ? "bg-slate-600 hover:bg-slate-500"
                      : "bg-slate-300 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>
        </div>
      ) : (
        <div
          className="portfolio-inset border-dashed p-5 text-sm text-[var(--text-soft)]"
        >
          <p className="font-semibold">Chess.com embed placeholder</p>
        </div>
      )}
    </SectionCard>
  );
}

function ChevronLeftIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.9"
    >
      <path d="m10 3.5-4.5 4.5 4.5 4.5" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.9"
    >
      <path d="m6 3.5 4.5 4.5-4.5 4.5" />
    </svg>
  );
}
