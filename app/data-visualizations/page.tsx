"use client";

import { DashboardEmbeds } from "@/components/data-visualizations/DashboardEmbeds";
import { AmbientPointerGlow } from "@/components/portfolio/AmbientPointerGlow";
import { BackToTopButton } from "@/components/portfolio/BackToTopButton";
import { ParallaxBackground } from "@/components/portfolio/ParallaxBackground";
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
        <section className="portfolio-hero-surface">
          <div className="dashboard-hero-grid">
            <div className="text-center md:text-left">
              <p className="portfolio-eyebrow site-text-static">
                Dashboards
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">
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
