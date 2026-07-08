"use client";

import { useEffect, useRef } from "react";

type DashboardEmbedsProps = {
  isDark: boolean;
};

const flourishScriptUrl = "https://public.flourish.studio/resources/embed.js";
const pokemonDashboardUrl =
  "https://public.tableau.com/app/profile/george.dinicola/viz/pokemon_analysis/PokemonRankings";
const pokemonDashboardEmbedUrl =
  "https://public.tableau.com/views/pokemon_analysis/PokemonRankings?:showVizHome=no&:embed=true&:toolbar=yes";
const collegeMajorSalariesDashboardUrl =
  "https://public.tableau.com/app/profile/george.dinicola/viz/CollegeMajorsMedianStartingandMid-CareerSalaries/CollegeMajorSalaries";
const collegeMajorSalariesDashboardEmbedUrl =
  "https://public.tableau.com/views/CollegeMajorsMedianStartingandMid-CareerSalaries/CollegeMajorSalaries?:showVizHome=no&:embed=true&:toolbar=yes";

function FlourishEmbed({ isDark }: DashboardEmbedsProps) {
  const embedRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const scriptElement = document.createElement("script");
    scriptElement.src = flourishScriptUrl;
    scriptElement.async = true;
    embedRef.current?.appendChild(scriptElement);

    return () => {
      scriptElement.remove();
    };
  }, []);

  return (
    <div
      className={`overflow-hidden border ${
        isDark ? "border-slate-700 bg-slate-950" : "border-slate-200 bg-white"
      }`}
    >
      <div
        ref={embedRef}
        className="flourish-embed flourish-bar-chart-race min-h-[420px]"
        data-src="visualisation/29463966"
      >
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://public.flourish.studio/visualisation/29463966/thumbnail"
            width="100%"
            alt="bar-chart-race visualization"
          />
        </noscript>
      </div>
    </div>
  );
}

type TableauEmbedProps = DashboardEmbedsProps & {
  dashboardUrl: string;
  embedUrl: string;
  title: string;
};

function TableauEmbed({ dashboardUrl, embedUrl, isDark, title }: TableauEmbedProps) {
  return (
    <div
      className={`overflow-hidden border ${
        isDark ? "border-slate-700 bg-slate-950" : "border-slate-200 bg-white"
      }`}
    >
      <div className="lg:hidden">
        <div className="space-y-4 p-5">
          <p className={`text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}>
            This dashboard is best viewed on a desktop or laptop because the Tableau filters need
            more horizontal space. On mobile, open it directly in Tableau or rotate your device for
            the most usable view.
          </p>
          <a
            className={`inline-flex items-center justify-center border px-4 py-2 text-sm font-semibold transition-colors ${
              isDark
                ? "border-cyan-400 text-cyan-200 hover:bg-cyan-400/10"
                : "border-cyan-700 text-cyan-800 hover:bg-cyan-50"
            }`}
            href={dashboardUrl}
            target="_blank"
            rel="noreferrer"
          >
            Open dashboard in Tableau
          </a>
        </div>
      </div>
      <iframe
        className="hidden h-[760px] w-full lg:block xl:h-[840px]"
        src={embedUrl}
        title={title}
        loading="lazy"
        allowFullScreen
      />
    </div>
  );
}

export function DashboardEmbeds({ isDark }: DashboardEmbedsProps) {
  return (
    <div className="space-y-8">
      <article className="space-y-3">
        <header>
          <h2 className="text-2xl font-bold">Animated Bar Chart Race</h2>
          <p className={`mt-1 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
            A time series data visualization using data from the World Bank.
          </p>
        </header>
        <FlourishEmbed isDark={isDark} />
      </article>
      <article className="space-y-3">
        <header>
          <h2 className="text-2xl font-bold">Pokemon Rankings Dashboard</h2>
          <p className={`mt-1 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
            An interactive Tableau Public dashboard for ranking and comparing Pokemon stats across
            generations. Best viewed on a desktop or laptop.
          </p>
        </header>
        <TableauEmbed
          dashboardUrl={pokemonDashboardUrl}
          embedUrl={pokemonDashboardEmbedUrl}
          isDark={isDark}
          title="Pokemon Rankings Tableau dashboard"
        />
      </article>
      <article className="space-y-3">
        <header>
          <h2 className="text-2xl font-bold">College Major Salaries Dashboard</h2>
          <p className={`mt-1 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
            An interactive Tableau Public dashboard comparing median starting and mid-career
            salaries by college major (2018 data). Best viewed on a desktop or laptop.
          </p>
        </header>
        <TableauEmbed
          dashboardUrl={collegeMajorSalariesDashboardUrl}
          embedUrl={collegeMajorSalariesDashboardEmbedUrl}
          isDark={isDark}
          title="College Major Salaries Tableau dashboard"
        />
      </article>
    </div>
  );
}
