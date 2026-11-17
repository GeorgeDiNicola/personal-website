"use client";

import { useEffect, useRef, useState } from "react";

import { CarouselControls } from "./CarouselControls";
import { SectionCard } from "@/components/personal/SectionCard";

const CHESS_EMBED_ORIGIN = "https://www.chess.com";
const MIN_CHESS_EMBED_HEIGHT = 320;
const MAX_CHESS_EMBED_HEIGHT = 1200;

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
  const chessEmbedRef = useRef<HTMLIFrameElement | null>(null);
  const totalGames = chessGamesEmbedIds.length;
  const activeGameId = chessGamesEmbedIds[activeGameIndex] ?? "";
  const activeEmbedHeight = lockedEmbedHeight ?? 560;
  const activeGameUrl = activeGameId
    ? `https://www.chess.com/emboard?move=5&id=${encodeURIComponent(activeGameId)}&theme=${
        isDark ? "dark" : "light"
      }`
    : "";

  useEffect(() => {
    if (!activeGameId) return;

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== CHESS_EMBED_ORIGIN) return;
      if (event.source !== chessEmbedRef.current?.contentWindow) return;
      if (!event.data || typeof event.data !== "object") return;

      const data = event.data as { id?: string; frameHeight?: number };
      const { id, frameHeight } = data;
      if (!id || typeof frameHeight !== "number" || !Number.isFinite(frameHeight)) return;
      if (id !== activeGameId) return;
      if (frameHeight < MIN_CHESS_EMBED_HEIGHT || frameHeight > MAX_CHESS_EMBED_HEIGHT) return;

      const measuredHeight = frameHeight + 37;
      setLockedEmbedHeight((current) => current ?? measuredHeight);
    };

    window.addEventListener("message", onMessage);
    // remove the listener to prevent memory leaks
    return () => window.removeEventListener("message", onMessage);
  }, [activeGameId]);

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
        <div className="mx-auto w-full max-w-[880px] personal-carousel">
          <CarouselControls
            itemName="Game"
            activeIndex={activeGameIndex}
            totalItems={totalGames}
            onPrevious={goToPreviousGame}
            onNext={goToNextGame}
          />

          <div className="flex flex-wrap items-center gap-1" role="group" aria-label="Choose a chess game">
            {chessGamesEmbedIds.map((id, index) => (
              <button
                key={id}
                type="button"
                aria-label={`View chess game ${index + 1}`}
                aria-pressed={index === activeGameIndex}
                onClick={() => setActiveGameIndex(index)}
                className="chess-pagination-button"
              >
                {index + 1}
              </button>
            ))}
          </div>

          <div className="portfolio-card chess-frame mx-auto w-full max-w-[880px] p-2 md:p-3">
            <div className="portfolio-inset overflow-hidden">
              <iframe
                ref={chessEmbedRef}
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

          <div className="text-center">
            <a href={activeGameUrl} target="_blank" rel="noopener noreferrer" className="portfolio-action">
              Open game on Chess.com <span aria-hidden="true">↗</span>
            </a>
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
