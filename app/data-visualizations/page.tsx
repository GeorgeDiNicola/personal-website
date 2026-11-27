"use client";

import { BackToProjectsLink } from "@/components/portfolio/BackToProjectsLink";

import { DashboardEmbeds } from "@/components/data-visualizations/DashboardEmbeds";
import { BackToTopButton } from "@/components/portfolio/BackToTopButton";
import { ScrollProgressBar } from "@/components/portfolio/ScrollProgressBar";
import { SiteNavbar } from "@/components/portfolio/SiteNavbar";
import { useTextColorPreference } from "@/components/portfolio/useTextColorPreference";
import { useThemePreference } from "@/components/portfolio/useThemePreference";

export default function DataVisualizationsPage() {
  const { theme, setTheme, isDark } = useThemePreference();
  const { textColor, setTextColor } = useTextColorPreference(theme);

  return (
    <main className="portfolio-page relative">
      <ScrollProgressBar />
      <SiteNavbar
        isDark={isDark}
        theme={theme}
        onThemeChange={setTheme}
        textColor={textColor}
        onTextColorChange={setTextColor}
      />

      <div id="main-content" tabIndex={-1} className="portfolio-content portfolio-content-spaced">
        <section className="portfolio-hero-surface">
          <BackToProjectsLink />
          <div className="text-center md:text-left">
            <p className="portfolio-eyebrow site-text-static">
              Dashboards
            </p>
            <h1 className="mt-3">
              Data Visualizations
            </h1>
            <p className="portfolio-copy mx-auto mt-4 max-w-3xl text-base md:mx-0 md:text-lg">
              Interactive dashboards built around public datasets, ranking, and exploratory analysis.
            </p>
          </div>
        </section>

        <DashboardEmbeds />
      </div>

      <BackToTopButton />
    </main>
  );
}
