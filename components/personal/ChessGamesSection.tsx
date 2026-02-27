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
            <p className={`text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}>
              Game {activeGameIndex + 1} of {totalGames}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goToPreviousGame}
                className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                  isDark
                    ? "border-slate-600 text-slate-200 hover:bg-slate-800"
                    : "border-slate-300 text-slate-700 hover:bg-slate-100"
                }`}
              >
                Previous
              </button>
              <button
                type="button"
                onClick={goToNextGame}
                className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                  isDark
                    ? "border-slate-600 text-slate-200 hover:bg-slate-800"
                    : "border-slate-300 text-slate-700 hover:bg-slate-100"
                }`}
              >
                Next
              </button>
            </div>
          </div>

          <div
            className={`mx-auto w-full max-w-[880px] rounded-3xl border p-2 shadow-lg md:p-3 ${
              isDark
                ? "border-slate-700 bg-gradient-to-b from-slate-900 to-slate-950 shadow-black/40"
                : "border-cyan-200 bg-gradient-to-b from-white to-cyan-50 shadow-cyan-900/10"
            }`}
          >
            <div
              className={`overflow-hidden rounded-2xl border ${
                isDark
                  ? "border-slate-600 bg-slate-950"
                  : "border-slate-300/60 bg-white"
              }`}
            >
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
                allowTransparency
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
                className={`h-2.5 w-7 rounded-full transition-colors ${
                  index === activeGameIndex
                    ? isDark
                      ? "bg-cyan-300"
                      : "bg-cyan-700"
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
          className={`rounded-2xl border border-dashed p-5 text-sm ${
            isDark ? "border-slate-600 text-slate-300" : "border-slate-300 text-slate-700"
          }`}
        >
          <p className="font-semibold">Chess.com embed placeholder</p>
        </div>
      )}
    </SectionCard>
  );
}
