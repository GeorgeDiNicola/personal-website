"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";

const worldBankDashboardEmbedUrl = "https://flo.uri.sh/visualisation/29463966/embed";
const pokemonDashboardUrl =
  "https://public.tableau.com/app/profile/george.dinicola/viz/pokemon_analysis/PokemonRankings";
const pokemonDashboardEmbedUrl =
  "https://public.tableau.com/views/pokemon_analysis/PokemonRankings?:showVizHome=no&:embed=true&:toolbar=yes";
const collegeMajorSalariesDashboardUrl =
  "https://public.tableau.com/app/profile/george.dinicola/viz/CollegeMajorsMedianStartingandMid-CareerSalaries/CollegeMajorSalaries";
const collegeMajorSalariesDashboardEmbedUrl =
  "https://public.tableau.com/views/CollegeMajorsMedianStartingandMid-CareerSalaries/CollegeMajorSalaries?:showVizHome=no&:embed=true&:toolbar=yes";

type DashboardFrameProps = {
  children: ReactNode;
  isLoaded?: boolean;
  label: string;
};

function DashboardFrame({ children, isLoaded = true, label }: DashboardFrameProps) {
  return (
    <div className="portfolio-inset dashboard-embed-frame">
      <div className="dashboard-frame-chrome site-text-static">
        <div className="dashboard-frame-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <span>{label}</span>
      </div>
      {!isLoaded ? <div className="dashboard-loading-sheen" aria-hidden="true" /> : null}
      {children}
    </div>
  );
}

function FlourishEmbed() {
  const [isLoaded, setLoaded] = useState(false);

  return (
    <DashboardFrame label="Flourish live embed" isLoaded={isLoaded}>
      <iframe
        src={worldBankDashboardEmbedUrl}
        title="Animated World Bank bar chart race"
        className="h-[520px] w-full border-0 md:h-[640px]"
        loading="lazy"
        onLoad={() => setLoaded(true)}
        sandbox="allow-same-origin allow-forms allow-scripts allow-downloads allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
      />
    </DashboardFrame>
  );
}

type TableauEmbedProps = {
  dashboardUrl: string;
  embedUrl: string;
  title: string;
};

function TableauEmbed({ dashboardUrl, embedUrl, title }: TableauEmbedProps) {
  const [isLoaded, setLoaded] = useState(false);

  useEffect(() => {
    const desktopMedia = window.matchMedia("(min-width: 1024px)");

    const syncLoadedState = () => {
      if (!desktopMedia.matches) setLoaded(true);
    };

    syncLoadedState();
    desktopMedia.addEventListener("change", syncLoadedState);

    return () => desktopMedia.removeEventListener("change", syncLoadedState);
  }, []);

  return (
    <DashboardFrame label="Tableau public embed" isLoaded={isLoaded}>
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
        className="hidden h-[760px] w-full border-0 lg:block xl:h-[840px]"
        src={embedUrl}
        title={title}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        allowFullScreen
      />
    </DashboardFrame>
  );
}

const dashboardCards = [
  {
    platform: "Flourish",
    title: "Animated Bar Chart Race",
    description: "A time series data visualization using data from the World Bank.",
    embed: <FlourishEmbed />
  },
  {
    platform: "Tableau",
    title: "Pokemon Rankings Dashboard",
    description:
      "An interactive Tableau Public dashboard for ranking and comparing Pokemon stats across generations. Best viewed on a desktop or laptop.",
    embed: (
      <TableauEmbed
        dashboardUrl={pokemonDashboardUrl}
        embedUrl={pokemonDashboardEmbedUrl}
        title="Pokemon Rankings Tableau dashboard"
      />
    )
  },
  {
    platform: "Tableau",
    title: "College Major Salaries Dashboard",
    description:
      "An interactive Tableau Public dashboard comparing median starting and mid-career salaries by college major (2018 data). Best viewed on a desktop or laptop.",
    embed: (
      <TableauEmbed
        dashboardUrl={collegeMajorSalariesDashboardUrl}
        embedUrl={collegeMajorSalariesDashboardEmbedUrl}
        title="College Major Salaries Tableau dashboard"
      />
    )
  }
] as const;

export function DashboardEmbeds() {
  return (
    <div className="space-y-8">
      {dashboardCards.map((dashboard) => (
        <article key={dashboard.title} className="portfolio-surface dashboard-card space-y-5">
          <header className="dashboard-card-header">
            <div>
              <p className="portfolio-eyebrow site-text-static">{dashboard.platform}</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                {dashboard.title}
              </h2>
              <p className="portfolio-copy mt-2">
                {dashboard.description}
              </p>
            </div>
          </header>
          {dashboard.embed}
        </article>
      ))}
    </div>
  );
}
