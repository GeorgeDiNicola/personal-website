"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type WorkExperience = {
  role: string;
  department?: string;
  company: string;
  period: string;
  summary: string;
};

type School = {
  name: string,
  period: string;
  degree1: string,
  degree2?: string,
  minor?: string,
}

type Project = {
  title: string;
  description: string;
  link?: string;
};

type Theme = "light" | "dark";

const workHistory: WorkExperience[] = [
  {
    role: "Software Engineer II",
    department: "Core Platform & Infrastructure",
    company: "Qualtrics",
    period: "2022 - 2024",
    summary: "Developed & scaled core infrastructure and identity systems, while maintaining Tier-0 system availability."
  },
  {
    role: "Full-Stack Software Engineer",
    department: "Product",
    company: "Columbia Build Lab Fellowship",
    period: "2021 - 2021",
    summary:
      "Spearheaded design and development of a financial tech web application using Java Spring Boot and JavaScript React, delivering MVP in 2 months."
  },
  {
    role: "Database Engineer II",
    department: "Business Intelligence Services",
    company: "Comcast Business",
    period: "2019 - 2021",
    summary:
      "Optimized data infrastructure and reliability, delivering automated systems that significantly reduced operational overhead and infrastructure costs. Built robust ingestion pipelines and custom internal tools to streamline cross-team development workflows."
  },
  {
    role: "Business Intelligence Analyst II",
    company: "Newrez",
    period: "2018 - 2019",
    summary:
      "Led the end-to-end modernization of data operations by developing database stored procedures, designing interactive dashboards, and engineering predictive machine learning models that significantly improved forecast accuracy."
  }
];

const schools: School[] = [
  {
    name: "Columbia University",
    period: "2021 - 2022",
    degree1: "MS Computer Science",
    minor: "Software Systems Concentration"
  },
  {
    name: "Drexel University, Pennoni Honors College",
    period: "2012 - 2017",
    degree1: "BA Mathematics",
    degree2: "BS Economics",
    minor: "Business Administration"
  }
]

const projects: Project[] = [
  {
    title: "Automated Jeopardy! Insights Dashboard & Predictive Machine Learning Model",
    description:
      "Designed and built a Jeopardy! data system that automates ETL processes for a live Tableau dashboard and implements a self-developed machine learning model to forecast game outcomes for reigning champions."
  },
  {
    title: "Macroeconomic Data Pipeline - World Bank Dataset",
    description: "World Bank dataset generation via a custom software application that discovers and groups high-quality indicators with rules-based logic & artificial intelligence, generates metadata, and performs ETL for macroeconomic data from the World Bank API. Currently has 12k+ views and 2.5k+ downloads.",
    link: "https://www.kaggle.com/datasets/georgejdinicola/world-bank-indicators"
  },
  {
    title: "Blockchain-based Middleware for Relational Database Management Systems",
    description:
      "Built a middleware application design presented in research studies for internally tamper-proofing centralized and decentralized relational database management systems for Topics in Software Engineering final project at Columbia Univeristy.",
    link: "https://github.com/GeorgeDiNicola/TDRB-Middleware-Extension"
  },
  {
    title: "Pokemon Rankings Dashboard",
    description: 
      "An interactive Tableau Public dashboard that provides analysis of Pokémon statistics, allowing users to rank and compare Pokémon from different generations across all core battle dimensions",
    link: "https://public.tableau.com/app/profile/george.dinicola/viz/pokemon_analysis/PokemonRankings"
  }
];

export default function HomePage() {
  const [theme, setTheme] = useState<Theme>("dark");
  const isDark = theme === "dark";

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("theme");
    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
      return;
    }

    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setTheme(prefersDark ? "dark" : "light");
  }, []);

  useEffect(() => {
    window.localStorage.setItem("theme", theme);
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  return (
    <main
      className={`min-h-screen transition-colors ${
        isDark
          ? "bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100"
          : "bg-gradient-to-b from-amber-50 via-white to-cyan-50 text-slate-900"
      }`}
    >
      <div className="fixed top-4 right-4 z-50">
        <div
          className={`inline-flex items-center gap-1 rounded-full border p-1 backdrop-blur ${
            isDark
              ? "border-slate-700 bg-slate-900/80"
              : "border-slate-300 bg-white/85"
          }`}
        >
          <button
            type="button"
            aria-label="Switch to light mode"
            title="Light mode"
            onClick={() => setTheme("light")}
            className={`h-9 w-9 rounded-full text-lg transition ${
              theme === "light"
                ? "bg-amber-300 text-slate-900"
                : isDark
                  ? "text-slate-300 hover:bg-slate-800"
                  : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            ☀
          </button>
          <button
            type="button"
            aria-label="Switch to dark mode"
            title="Dark mode"
            onClick={() => setTheme("dark")}
            className={`h-9 w-9 rounded-full text-lg transition ${
              theme === "dark"
                ? "bg-slate-700 text-white"
                : isDark
                  ? "text-slate-300 hover:bg-slate-800"
                  : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            ☾
          </button>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-6 py-12 md:px-10 md:py-16">
        <section className="relative">
          <div
            className={`pointer-events-none absolute -top-14 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full blur-3xl ${
              isDark ? "bg-cyan-500/15" : "bg-cyan-300/40"
            }`}
          />
          <div
            className={`relative mx-auto max-w-4xl overflow-hidden rounded-[2rem] border px-6 py-10 text-center md:px-12 md:py-14 ${
              isDark
                ? "border-slate-700 bg-slate-900/75"
                : "border-cyan-100 bg-gradient-to-br from-white via-cyan-50 to-amber-50"
            }`}
          >
            <div
              className={`pointer-events-none absolute inset-0 opacity-70 ${
                isDark
                  ? "bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.15),transparent_55%)]"
                  : "bg-[radial-gradient(circle_at_top,rgba(14,116,144,0.16),transparent_55%)]"
              }`}
            />
            <div className="relative flex flex-col items-center gap-5">
              <div className="relative">
                <div
                  className={`absolute -inset-1 rounded-full blur-sm ${
                    isDark
                      ? "bg-gradient-to-br from-cyan-300/50 to-amber-200/40"
                      : "bg-gradient-to-br from-cyan-500/45 to-amber-400/45"
                  }`}
                />
                <Image
                  src="/me.jpg"
                  alt="Portrait of George DiNicola"
                  width={168}
                  height={168}
                  priority
                  className={`relative h-32 w-32 rounded-full object-cover md:h-40 md:w-40 ${
                    isDark ? "border-2 border-slate-800" : "border-2 border-white"
                  }`}
                />
              </div>

              <p
                className={`text-sm font-medium uppercase tracking-[0.2em] ${
                  isDark ? "text-cyan-300" : "text-cyan-700"
                }`}
              >
                Personal Portfolio
              </p>
              <h1 className="text-3xl font-bold leading-tight md:text-5xl">
                George DiNicola
              </h1>
              <div className="max-w-3xl space-y-3">
                <h2 className="text-xl font-semibold md:text-2xl">About Me</h2>
                <p
                  className={`text-base leading-relaxed md:text-lg ${
                    isDark ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  Software Engineer with 3+ years of experience. I specialize in
                  production backend systems and data infrastructure, with a
                  deep interest in distributed systems and machine learning.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div
            className={`relative overflow-hidden rounded-3xl border p-6 md:p-8 ${
              isDark
                ? "border-slate-700 bg-slate-900/70"
                : "border-cyan-100 bg-gradient-to-br from-white via-cyan-50 to-amber-50"
            }`}
          >
            <div
              className={`pointer-events-none absolute -top-24 -left-10 h-56 w-56 rounded-full blur-3xl ${
                isDark ? "bg-amber-500/10" : "bg-amber-200/40"
              }`}
            />
            <div
              className={`pointer-events-none absolute -bottom-24 -right-8 h-56 w-56 rounded-full blur-3xl ${
                isDark ? "bg-cyan-500/10" : "bg-cyan-300/30"
              }`}
            />

            <div className="relative grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <p
                  className={`text-sm font-medium uppercase tracking-[0.18em] ${
                    isDark ? "text-cyan-300" : "text-cyan-700"
                  }`}
                >
                  Experience
                </p>
                <h2 className="mt-3 text-2xl font-semibold md:text-3xl">
                  Work History
                </h2>
                <p
                  className={`mt-3 text-sm leading-relaxed ${
                    isDark ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  Roles across platform infrastructure, full-stack product
                  development, and data engineering
                </p>
              </div>

              <div className="relative lg:col-span-8">
                <div
                  className={`absolute top-1 bottom-1 left-2 w-px ${
                    isDark ? "bg-slate-700" : "bg-slate-300"
                  }`}
                />
                <div className="space-y-8">
                  {workHistory.map((job) => (
                    <article key={`${job.company}-${job.role}`} className="relative pl-8">
                      <span
                        className={`absolute top-1 left-0 inline-flex h-4 w-4 rounded-full border-2 ${
                          isDark
                            ? "border-cyan-300 bg-slate-900"
                            : "border-cyan-600 bg-white"
                        }`}
                      />
                      <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
                        <h3 className="text-lg font-semibold">
                          {job.role} · {job.company}
                        </h3>
                        <p
                          className={`text-sm font-medium ${
                            isDark ? "text-slate-400" : "text-slate-600"
                          }`}
                        >
                          {job.period}
                        </p>
                      </div>
                      <p
                        className={`mt-1 text-sm font-semibold ${
                          isDark ? "text-slate-200" : "text-slate-800"
                        }`}
                      >
                        {job.department}
                      </p>
                      <p
                        className={`mt-2 max-w-3xl text-sm leading-relaxed ${
                          isDark ? "text-slate-300" : "text-slate-700"
                        }`}
                      >
                        {job.summary}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <div
            className={`relative overflow-hidden rounded-3xl border p-6 md:p-8 ${
              isDark
                ? "border-slate-700 bg-slate-900/70"
                : "border-cyan-100 bg-gradient-to-br from-white via-cyan-50 to-amber-50"
            }`}
          >
            <div
              className={`pointer-events-none absolute -top-20 -right-16 h-56 w-56 rounded-full blur-3xl ${
                isDark ? "bg-cyan-500/10" : "bg-cyan-300/30"
              }`}
            />
            <div
              className={`pointer-events-none absolute -bottom-24 -left-10 h-56 w-56 rounded-full blur-3xl ${
                isDark ? "bg-amber-400/10" : "bg-amber-200/40"
              }`}
            />

            <div className="relative grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <p
                  className={`text-sm font-medium uppercase tracking-[0.18em] ${
                    isDark ? "text-cyan-300" : "text-cyan-700"
                  }`}
                >
                  Education
                </p>
                <h2 className="mt-3 text-2xl font-semibold md:text-3xl">
                  Academic Background
                </h2>
                <p
                  className={`mt-3 text-sm leading-relaxed ${
                    isDark ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  Foundation in computer science, mathematics, and economics
                  with a practical focus on software systems
                </p>
              </div>

              <div className="relative lg:col-span-8">
                <div
                  className={`absolute top-1 bottom-1 left-2 w-px ${
                    isDark ? "bg-slate-700" : "bg-slate-300"
                  }`}
                />
                <div className="space-y-7">
                  {schools.map((school) => (
                    <article key={school.name} className="relative pl-8">
                      <span
                        className={`absolute top-1 left-0 inline-flex h-4 w-4 rounded-full border-2 ${
                          isDark
                            ? "border-cyan-300 bg-slate-900"
                            : "border-cyan-600 bg-white"
                        }`}
                      />
                      <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
                        <h3 className="text-lg font-semibold">{school.name}</h3>
                        <p
                          className={`text-sm font-medium ${
                            isDark ? "text-slate-400" : "text-slate-600"
                          }`}
                        >
                          {school.period}
                        </p>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-medium ${
                            isDark
                              ? "border-slate-600 bg-slate-800 text-slate-200"
                              : "border-slate-300 bg-white text-slate-700"
                          }`}
                        >
                          {school.degree1}
                        </span>
                        {school.degree2 && (
                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-medium ${
                              isDark
                                ? "border-slate-600 bg-slate-800 text-slate-200"
                                : "border-slate-300 bg-white text-slate-700"
                            }`}
                          >
                            {school.degree2}
                          </span>
                        )}
                        {school.minor && (
                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-medium ${
                              isDark
                                ? "border-cyan-800 bg-cyan-950/50 text-cyan-200"
                                : "border-cyan-200 bg-cyan-100/60 text-cyan-800"
                            }`}
                          >
                            Minor: {school.minor}
                          </span>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <div
            className={`relative overflow-hidden rounded-3xl border p-6 md:p-8 ${
              isDark
                ? "border-slate-700 bg-slate-900/70"
                : "border-cyan-100 bg-gradient-to-br from-white via-cyan-50 to-amber-50"
            }`}
          >
            <div
              className={`pointer-events-none absolute -top-24 -right-10 h-56 w-56 rounded-full blur-3xl ${
                isDark ? "bg-cyan-500/10" : "bg-cyan-300/30"
              }`}
            />
            <div
              className={`pointer-events-none absolute -bottom-24 -left-8 h-56 w-56 rounded-full blur-3xl ${
                isDark ? "bg-amber-500/10" : "bg-amber-200/40"
              }`}
            />

            <div className="relative grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <p
                  className={`text-sm font-medium uppercase tracking-[0.18em] ${
                    isDark ? "text-cyan-300" : "text-cyan-700"
                  }`}
                >
                  Projects
                </p>
                <h2 className="mt-3 text-2xl font-semibold md:text-3xl">
                  Featured Work
                </h2>
                <p
                  className={`mt-3 text-sm leading-relaxed ${
                    isDark ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  Selected projects spanning analytics, automation, and software
                  systems
                </p>
              </div>

              <div className="lg:col-span-8">
                <div className="grid gap-4 sm:grid-cols-2">
                  {projects.map((project) => (
                    <article
                      key={project.title}
                      className={`rounded-2xl border p-5 ${
                        isDark
                          ? "border-slate-700 bg-slate-900/80"
                          : "border-slate-200 bg-white/90"
                      }`}
                    >
                      <h3 className="text-base font-semibold md:text-lg">
                        {project.title}
                      </h3>
                      <p
                        className={`mt-2 text-sm leading-relaxed ${
                          isDark ? "text-slate-300" : "text-slate-700"
                        }`}
                      >
                        {project.description}
                      </p>
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`mt-4 inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] transition ${
                            isDark
                              ? "border-cyan-700/70 text-cyan-200 hover:bg-cyan-900/30"
                              : "border-cyan-300 text-cyan-800 hover:bg-cyan-100/70"
                          }`}
                        >
                          See Project
                        </a>
                      )}
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
