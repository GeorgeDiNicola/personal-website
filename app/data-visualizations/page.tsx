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
    <main
      className={`relative min-h-screen overflow-x-clip transition-colors ${
        isDark
          ? "bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100"
          : "bg-gradient-to-b from-amber-50 via-white to-cyan-50 text-slate-900"
      }`}
    >
      <ParallaxBackground isDark={isDark} />
      <ScrollProgressBar isDark={isDark} />
      <SiteNavbar
        isDark={isDark}
        theme={theme}
        onThemeChange={setTheme}
        textColor={textColor}
        onTextColorChange={setTextColor}
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl space-y-8 px-6 pb-12 pt-8 md:px-10 md:pb-16 md:pt-10">
        <section
          className={`border p-6 md:p-8 ${
            isDark
              ? "border-slate-700 bg-slate-900/70"
              : "border-cyan-100 bg-gradient-to-br from-white via-cyan-50 to-amber-50"
          }`}
        >
          <div className="text-center">
            <p
              className={`site-text-static text-sm font-medium uppercase tracking-[0.2em] ${
                isDark ? "text-cyan-300" : "text-cyan-700"
              }`}
            >
              Dashboards
            </p>
            <h1 className="mt-2 text-3xl font-bold md:text-5xl">Data Visualizations</h1>
            <p
              className={`mx-auto mt-3 max-w-3xl text-base leading-relaxed md:text-lg ${
                isDark ? "text-slate-300" : "text-slate-700"
              }`}
            >
              Interactive data visualization dashboards I&apos;ve created
            </p>
          </div>
        </section>

        <DashboardEmbeds isDark={isDark} />
      </div>

      <BackToTopButton isDark={isDark} />
    </main>
  );
}
