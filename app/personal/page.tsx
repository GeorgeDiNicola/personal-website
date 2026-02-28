"use client";

import { ChessGamesSection } from "@/components/personal/ChessGamesSection";
import { OpenLibraryBooksSection } from "@/components/personal/OpenLibraryBooksSection";
import { OutdoorPhotographySection } from "@/components/personal/OutdoorPhotographySection";
import { BackToTopButton } from "@/components/portfolio/BackToTopButton";
import { ParallaxBackground } from "@/components/portfolio/ParallaxBackground";
import { ScrollProgressBar } from "@/components/portfolio/ScrollProgressBar";
import { SiteNavbar } from "@/components/portfolio/SiteNavbar";
import { useThemePreference } from "@/components/portfolio/useThemePreference";

const OPEN_LIBRARY_USERNAME = process.env.NEXT_PUBLIC_OPEN_LIBRARY_USERNAME?.trim() || "george3d";

export default function PersonalPage() {
  const { theme, setTheme, isDark } = useThemePreference();

  return (
    <main
      className={`relative min-h-screen overflow-x-clip transition-colors ${
        isDark
          ? "bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100"
          : "bg-gradient-to-b from-amber-50 via-white to-cyan-50 text-slate-900"
      }`}
    >
      <ParallaxBackground isDark={isDark} />
      <ScrollProgressBar isDark={isDark} />
      <SiteNavbar isDark={isDark} theme={theme} onThemeChange={setTheme} />

      <div className="relative z-10 mx-auto w-full max-w-6xl space-y-8 px-6 pb-12 pt-8 md:px-10 md:pb-16 md:pt-10">
        <section
          className={`rounded-3xl border p-6 md:p-8 ${
            isDark
              ? "border-slate-700 bg-slate-900/70"
              : "border-cyan-100 bg-gradient-to-br from-white via-cyan-50 to-amber-50"
          }`}
        >
          <div className="text-center">
            <p
              className={`text-sm font-medium uppercase tracking-[0.2em] ${
                isDark ? "text-cyan-300" : "text-cyan-700"
              }`}
            >
              Personal
            </p>
            <h1 className="mt-2 text-3xl font-bold md:text-5xl">Personal Life</h1>
            <p className={`mt-3 text-base leading-relaxed md:text-lg ${isDark ? "text-slate-300" : "text-slate-700"}`}>
              A collection of my interests outside of software engineering
            </p>
          </div>
        </section>

        <OutdoorPhotographySection isDark={isDark} />
        <ChessGamesSection isDark={isDark} />
        <OpenLibraryBooksSection isDark={isDark} username={OPEN_LIBRARY_USERNAME} />
      </div>

      <BackToTopButton isDark={isDark} />
    </main>
  );
}
