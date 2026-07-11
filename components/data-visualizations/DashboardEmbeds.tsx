"use client";

import { useEffect, useRef } from "react";

const flourishScriptUrl = "https://public.flourish.studio/resources/embed.js";
const pokemonDashboardUrl =
  "https://public.tableau.com/app/profile/george.dinicola/viz/pokemon_analysis/PokemonRankings";
const pokemonDashboardEmbedUrl =
  "https://public.tableau.com/views/pokemon_analysis/PokemonRankings?:showVizHome=no&:embed=true&:toolbar=yes";
const collegeMajorSalariesDashboardUrl =
  "https://public.tableau.com/app/profile/george.dinicola/viz/CollegeMajorsMedianStartingandMid-CareerSalaries/CollegeMajorSalaries";
const collegeMajorSalariesDashboardEmbedUrl =
  "https://public.tableau.com/views/CollegeMajorsMedianStartingandMid-CareerSalaries/CollegeMajorSalaries?:showVizHome=no&:embed=true&:toolbar=yes";

function FlourishEmbed() {
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
    <div className="portfolio-inset overflow-hidden">
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

type TableauEmbedProps = {
  dashboardUrl: string;
  embedUrl: string;
  title: string;
};

function TableauEmbed({ dashboardUrl, embedUrl, title }: TableauEmbedProps) {
  return (
    <div className="portfolio-inset overflow-hidden">
      <div className="lg:hidden">
        <div className="space-y-4 p-5">
          <p className="portfolio-copy text-sm">
            This dashboard is best viewed on a desktop or laptop because the Tableau filters need
            more horizontal space. On mobile, open it directly in Tableau or rotate your device for
            the most usable view.
          </p>
          <a
            className="portfolio-action px-4 py-2"
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

export function DashboardEmbeds() {
  return (
    <div className="space-y-8">
      <article className="portfolio-surface space-y-4">
        <header>
          <p className="portfolio-eyebrow site-text-static">Flourish</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">
            Animated Bar Chart Race
          </h2>
          <p className="portfolio-copy mt-2">
            A time series data visualization using data from the World Bank.
          </p>
        </header>
        <FlourishEmbed />
      </article>
      <article className="portfolio-surface space-y-4">
        <header>
          <p className="portfolio-eyebrow site-text-static">Tableau</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">
            Pokemon Rankings Dashboard
          </h2>
          <p className="portfolio-copy mt-2">
            An interactive Tableau Public dashboard for ranking and comparing Pokemon stats across
            generations. Best viewed on a desktop or laptop.
          </p>
        </header>
        <TableauEmbed
          dashboardUrl={pokemonDashboardUrl}
          embedUrl={pokemonDashboardEmbedUrl}
          title="Pokemon Rankings Tableau dashboard"
        />
      </article>
      <article className="portfolio-surface space-y-4">
        <header>
          <p className="portfolio-eyebrow site-text-static">Tableau</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">
            College Major Salaries Dashboard
          </h2>
          <p className="portfolio-copy mt-2">
            An interactive Tableau Public dashboard comparing median starting and mid-career
            salaries by college major (2018 data). Best viewed on a desktop or laptop.
          </p>
        </header>
        <TableauEmbed
          dashboardUrl={collegeMajorSalariesDashboardUrl}
          embedUrl={collegeMajorSalariesDashboardEmbedUrl}
          title="College Major Salaries Tableau dashboard"
        />
      </article>
    </div>
  );
}
