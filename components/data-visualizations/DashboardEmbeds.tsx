"use client";

import { useEffect, useRef } from "react";

type DashboardEmbedsProps = {
  isDark: boolean;
};

type TableauEmbedProps = {
  id: string;
  title: string;
  name: string;
  staticImage: string;
  rssImage: string;
  isDark: boolean;
};

const tableauScriptUrl = "https://public.tableau.com/javascripts/api/viz_v1.js";
const flourishScriptUrl = "https://public.flourish.studio/resources/embed.js";

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
        <noscript
          dangerouslySetInnerHTML={{
            __html:
              '<img src="https://public.flourish.studio/visualisation/29463966/thumbnail" width="100%" alt="bar-chart-race visualization" />'
          }}
        />
      </div>
    </div>
  );
}

function TableauEmbed({ id, title, name, staticImage, rssImage, isDark }: TableauEmbedProps) {
  const placeholderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const placeholderElement = placeholderRef.current;
    const vizElement = placeholderElement?.getElementsByTagName("object")[0];
    if (!placeholderElement || !vizElement) return;

    const resizeViz = () => {
      vizElement.style.width = "100%";
      vizElement.style.height = `${Math.max(420, placeholderElement.offsetWidth * 0.75)}px`;
    };

    resizeViz();
    window.addEventListener("resize", resizeViz);

    const scriptElement = document.createElement("script");
    scriptElement.src = tableauScriptUrl;
    scriptElement.async = true;
    vizElement.parentNode?.insertBefore(scriptElement, vizElement);

    return () => {
      window.removeEventListener("resize", resizeViz);
      scriptElement.remove();
    };
  }, []);

  return (
    <div
      className={`overflow-hidden border ${
        isDark ? "border-slate-700 bg-slate-950" : "border-slate-200 bg-white"
      }`}
    >
      <div ref={placeholderRef} id={id} className="tableauPlaceholder relative">
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<a href="#"><img alt="${title}" src="${rssImage}" style="border: none" /></a>`
          }}
        />
        <object className="tableauViz hidden" aria-label={title}>
          <param name="host_url" value="https%3A%2F%2Fpublic.tableau.com%2F" />
          <param name="embed_code_version" value="3" />
          <param name="site_root" value="" />
          <param name="name" value={name} />
          <param name="tabs" value="no" />
          <param name="toolbar" value="yes" />
          <param name="static_image" value={staticImage} />
          <param name="animate_transition" value="yes" />
          <param name="display_static_image" value="yes" />
          <param name="display_spinner" value="yes" />
          <param name="display_overlay" value="yes" />
          <param name="display_count" value="yes" />
          <param name="language" value="en-US" />
        </object>
      </div>
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
          <h2 className="text-2xl font-bold">Pokemon Rankings</h2>
          <p className={`mt-1 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
            A Tableau dashboard exploring Pokemon ranking analysis.
          </p>
        </header>
        <TableauEmbed
          id="viz1782160227417"
          title="Pokemon rankings dashboard"
          name="pokemon_analysis/PokemonRankings"
          staticImage="https://public.tableau.com/static/images/po/pokemon_analysis/PokemonRankings/1.png"
          rssImage="https://public.tableau.com/static/images/po/pokemon_analysis/PokemonRankings/1_rss.png"
          isDark={isDark}
        />
      </article>

      <article className="space-y-3">
        <header>
          <h2 className="text-2xl font-bold">College Major Salaries</h2>
          <p className={`mt-1 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
            A Tableau dashboard on starting and mid-career salaries by college major.
          </p>
        </header>
        <TableauEmbed
          id="viz1782160206109"
          title="College Major Salaries"
          name="CollegeMajorsMedianStartingandMid-CareerSalaries/CollegeMajorSalaries"
          staticImage="https://public.tableau.com/static/images/Co/CollegeMajorsMedianStartingandMid-CareerSalaries/CollegeMajorSalaries/1.png"
          rssImage="https://public.tableau.com/static/images/Co/CollegeMajorsMedianStartingandMid-CareerSalaries/CollegeMajorSalaries/1_rss.png"
          isDark={isDark}
        />
      </article>
    </div>
  );
}
