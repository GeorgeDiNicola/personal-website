"use client";

import Link from "next/link";

import { JeopardyPredictionSection } from "@/components/personal/JeopardyPredictionSection";
import { AmbientPointerGlow } from "@/components/portfolio/AmbientPointerGlow";
import { BackToTopButton } from "@/components/portfolio/BackToTopButton";
import { ParallaxBackground } from "@/components/portfolio/ParallaxBackground";
import { ScrollProgressBar } from "@/components/portfolio/ScrollProgressBar";
import { SiteNavbar } from "@/components/portfolio/SiteNavbar";
import { useTextColorPreference } from "@/components/portfolio/useTextColorPreference";
import { useThemePreference } from "@/components/portfolio/useThemePreference";

export function JeopardyProjectPage() {
  const { theme, setTheme, isDark } = useThemePreference();
  const { textColor, setTextColor } = useTextColorPreference(theme);

  return (
    <main className="portfolio-page relative">
      <ParallaxBackground isDark={isDark} />
      <AmbientPointerGlow />
      <ScrollProgressBar />
      <SiteNavbar
        isDark={isDark}
        theme={theme}
        onThemeChange={setTheme}
        textColor={textColor}
        onTextColorChange={setTextColor}
      />

      <div className="portfolio-content portfolio-content-spaced">
        <header className="portfolio-hero-surface">
          <Link href="/#projects" className="portfolio-action mb-6 px-4 py-2 text-sm">
            <span aria-hidden="true" className="site-text-static">←</span>
            <span className="site-text-static">Back to projects</span>
          </Link>
          <p className="portfolio-eyebrow site-text-static">Machine learning · Data engineering</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">
            Jeopardy! Prediction Model
          </h1>
          <p className="portfolio-copy mt-4 max-w-2xl">
            Live predictions and a transparent record of past results.
          </p>
        </header>

        <JeopardyPredictionSection isDark={isDark} />
      </div>

      <BackToTopButton />
    </main>
  );
}
