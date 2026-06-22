"use client";

import { useEffect, useRef } from "react";

type DashboardEmbedsProps = {
  isDark: boolean;
};

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
    </div>
  );
}
