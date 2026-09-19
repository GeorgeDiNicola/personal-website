"use client";

import Link from "next/link";

import { DashboardEmbeds } from "@/components/data-visualizations/DashboardEmbeds";
import { BackToTopButton } from "@/components/portfolio/BackToTopButton";
import { ScrollProgressBar } from "@/components/portfolio/ScrollProgressBar";
import { SiteNavbar } from "@/components/portfolio/SiteNavbar";
import { useTextColorPreference } from "@/components/portfolio/useTextColorPreference";
import { useThemePreference } from "@/components/portfolio/useThemePreference";

const dashboardSignals = [
  { name: "World Bank time series", type: "Flourish" },
  { name: "Pokemon rankings", type: "Tableau" },
  { name: "College major salaries", type: "Tableau" }
] as const;

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
          <Link href="/#projects" className="portfolio-action mb-6 px-4 py-2 text-sm">
            <span aria-hidden="true" className="site-text-static">←</span>
            <span className="site-text-static">Back to projects</span>
          </Link>
          <div className="dashboard-hero-grid">
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

            <div className="dashboard-signal-panel p-4 md:p-5">
              {dashboardSignals.map((signal) => (
                <div key={signal.name} className="dashboard-signal-row">
                  <span className="dashboard-signal-name">{signal.name}</span>
                  <span className="dashboard-signal-type site-text-static">
                    {signal.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <DashboardEmbeds />
      </div>

      <BackToTopButton />
    </main>
  );
}
