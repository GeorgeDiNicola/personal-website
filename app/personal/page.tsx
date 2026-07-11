"use client";

import { ChessGamesSection } from "@/components/personal/ChessGamesSection";
import { OpenLibraryBooksSection } from "@/components/personal/OpenLibraryBooksSection";
import { OutdoorPhotographySection } from "@/components/personal/OutdoorPhotographySection";
import { BackToTopButton } from "@/components/portfolio/BackToTopButton";
import { ParallaxBackground } from "@/components/portfolio/ParallaxBackground";
import { ScrollProgressBar } from "@/components/portfolio/ScrollProgressBar";
import { SiteNavbar } from "@/components/portfolio/SiteNavbar";
import { useTextColorPreference } from "@/components/portfolio/useTextColorPreference";
import { useThemePreference } from "@/components/portfolio/useThemePreference";

const OPEN_LIBRARY_USERNAME = process.env.NEXT_PUBLIC_OPEN_LIBRARY_USERNAME?.trim() || "george3d";

export default function PersonalPage() {
  const { theme, setTheme, isDark } = useThemePreference();
  const { textColor, setTextColor } = useTextColorPreference(theme);

  return (
    <main className="portfolio-page relative">
      <ParallaxBackground isDark={isDark} />
      <ScrollProgressBar />
      <SiteNavbar
        isDark={isDark}
        theme={theme}
        onThemeChange={setTheme}
        textColor={textColor}
        onTextColorChange={setTextColor}
      />

      <div className="portfolio-content portfolio-content-spaced">
        <section className="portfolio-hero-surface">
          <div className="text-center">
            <p className="portfolio-eyebrow site-text-static">
              Personal
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">
              Personal Life
            </h1>
            <p className="portfolio-copy mx-auto mt-4 max-w-2xl text-base md:text-lg">
              A collection of my interests outside of software engineering
            </p>
          </div>
        </section>

        <OutdoorPhotographySection isDark={isDark} />
        <ChessGamesSection isDark={isDark} />
        <OpenLibraryBooksSection isDark={isDark} username={OPEN_LIBRARY_USERNAME} />
      </div>

      <BackToTopButton />
    </main>
  );
}
