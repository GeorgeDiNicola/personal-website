"use client";

import { useEffect, useState } from "react";

import { SectionCard } from "@/components/personal/SectionCard";

const chessGamesEmbedIds = ["14646933", 
  "14646659", 
  "14646697", 
  "14646749", 
  "14646787", 
  "14646781", 
  "14646719", 
  "14646731", 
  "14646737", 
  "14646771"];

type ChessGamesSectionProps = {
  isDark: boolean;
};

export function ChessGamesSection({ isDark }: ChessGamesSectionProps) {
  const [activeGameIndex, setActiveGameIndex] = useState(0);
  const [embedHeights, setEmbedHeights] = useState<Record<string, number>>({});
  const totalGames = chessGamesEmbedIds.length;
  const activeGameId = chessGamesEmbedIds[activeGameIndex] ?? "";
  const activeEmbedHeight = embedHeights[activeGameId] ?? 560;
  const activeGameUrl = activeGameId
    ? `https://www.chess.com/emboard?move=5&id=${encodeURIComponent(activeGameId)}`
    : "";

  useEffect(() => {
    if (!totalGames) return;

    const onMessage = (event: MessageEvent) => {
      if (!event.origin.includes("chess.com")) return;

      const data = event.data as { id?: string; frameHeight?: number };
      const { id, frameHeight } = data;
      if (!id || typeof frameHeight !== "number") return;
      if (!chessGamesEmbedIds.includes(id)) return;

      setEmbedHeights((current) => ({
        ...current,
        [id]: frameHeight + 37
      }));
    };

    window.addEventListener("message", onMessage);
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
      title="Some of my best chess games from Chess.com"
      subtitle="Browse one game at a time using the carousel controls"
      isDark={isDark}
    >
      {activeGameUrl ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
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
            className={`overflow-hidden rounded-2xl border ${
              isDark
                ? "border-slate-600 bg-slate-950/90"
                : "border-slate-300/60 bg-white"
            }`}
          >
            <iframe
              id={activeGameId}
              title={`Chess game ${activeGameIndex + 1}`}
              src={activeGameUrl}
              className="w-full"
              style={{ height: `${activeEmbedHeight}px`, border: "none" }}
              loading="lazy"
              allowTransparency
            />
          </div>

          <div className="flex flex-wrap gap-2">
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
          <p className="mt-2">
            Add your embed IDs to <code>chessGamesEmbedIds</code> in
            <code> components/personal/ChessGamesSection.tsx</code>.
          </p>
          <p className="mt-2">
            Example: <code>[&quot;14646659&quot;, &quot;14646697&quot;]</code>
          </p>
        </div>
      )}
    </SectionCard>
  );
}
