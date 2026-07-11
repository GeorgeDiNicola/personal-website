"use client";

import { DashboardEmbeds } from "@/components/data-visualizations/DashboardEmbeds";
import { BackToTopButton } from "@/components/portfolio/BackToTopButton";
import { ParallaxBackground } from "@/components/portfolio/ParallaxBackground";
import { ScrollProgressBar } from "@/components/portfolio/ScrollProgressBar";
import { SiteNavbar } from "@/components/portfolio/SiteNavbar";
import { useTextColorPreference } from "@/components/portfolio/useTextColorPreference";
import { useThemePreference } from "@/components/portfolio/useThemePreference";

export default function DataVisualizationsPage() {
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
              Dashboards
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">
              Data Visualizations
            </h1>
            <p className="portfolio-copy mx-auto mt-4 max-w-3xl text-base md:text-lg">
              Interactive data visualization dashboards I&apos;ve created
            </p>
          </div>
        </section>

        <DashboardEmbeds />
      </div>

      <BackToTopButton />
    </main>
  );
}
