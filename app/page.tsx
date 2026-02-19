"use client";

import { useEffect, useState } from "react";

import { BackToTopButton } from "@/components/portfolio/BackToTopButton";
import { EducationSection } from "@/components/portfolio/EducationSection";
import { GitHubActivitySection } from "@/components/portfolio/GitHubActivitySection";
import { HeroSection } from "@/components/portfolio/HeroSection";
import { ProjectsSection } from "@/components/portfolio/ProjectsSection";
import { SkillsSection } from "@/components/portfolio/SkillsSection";
import { ThemeToggle } from "@/components/portfolio/ThemeToggle";
import { WorkHistorySection } from "@/components/portfolio/WorkHistorySection";
import {
  githubUsername,
  projects,
  schools,
  skills,
  workHistory
} from "@/components/portfolio/data";
import type { Theme } from "@/components/portfolio/types";

export default function HomePage() {
  const [theme, setTheme] = useState<Theme>("light");
  const isDark = theme === "dark";
  const githubUsername = "GeorgeDiNicola";
  const githubProfileUrl = `https://github.com/${githubUsername}`;
  const githubCalendarUrl = `https://ghchart.rshah.org/${
    isDark ? "42F527" : "0f766e"
  }/${githubUsername}`;

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
      <ThemeToggle isDark={isDark} theme={theme} onThemeChange={setTheme} />

      <div className="mx-auto w-full max-w-6xl px-6 py-12 md:px-10 md:py-16">
        <HeroSection isDark={isDark} />
        <SkillsSection isDark={isDark} skills={skills} />
        <WorkHistorySection isDark={isDark} workHistory={workHistory} />
        <EducationSection isDark={isDark} schools={schools} />
        <GitHubActivitySection
          isDark={isDark}
          githubUsername={githubUsername}
          githubProfileUrl={githubProfileUrl}
          githubCalendarUrl={githubCalendarUrl}
        />
        <ProjectsSection isDark={isDark} projects={projects} />
      </div>

      <BackToTopButton isDark={isDark} />
    </main>
  );
}
