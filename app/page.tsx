"use client";

import { useEffect, useSyncExternalStore } from "react";

import { BackToTopButton } from "@/components/portfolio/BackToTopButton";
import { EducationSection } from "@/components/portfolio/EducationSection";
import { GitHubActivitySection } from "@/components/portfolio/GitHubActivitySection";
import { HeroSection } from "@/components/portfolio/HeroSection";
import { ParallaxBackground } from "@/components/portfolio/ParallaxBackground";
import { ProjectsSection } from "@/components/portfolio/ProjectsSection";
import { ScrollProgressBar } from "@/components/portfolio/ScrollProgressBar";
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

const THEME_STORAGE_KEY = "theme";
const THEME_CHANGED_EVENT = "theme-change";

const getStoredTheme = (): Theme | null => {
  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  return storedTheme === "light" || storedTheme === "dark" ? storedTheme : null;
};

const getThemeSnapshot = (): Theme => {
  const storedTheme = getStoredTheme();
  if (storedTheme) return storedTheme;

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const subscribeTheme = (onStoreChange: () => void) => {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  const handleStorage = (event: StorageEvent) => {
    if (event.key === THEME_STORAGE_KEY) onStoreChange();
  };

  const handleMediaChange = () => {
    if (!getStoredTheme()) onStoreChange();
  };

  const handleThemeChange = () => onStoreChange();

  window.addEventListener("storage", handleStorage);
  mediaQuery.addEventListener("change", handleMediaChange);
  window.addEventListener(THEME_CHANGED_EVENT, handleThemeChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    mediaQuery.removeEventListener("change", handleMediaChange);
    window.removeEventListener(THEME_CHANGED_EVENT, handleThemeChange);
  };
};

export default function HomePage() {
  const theme = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    () => "light"
  );

  const setTheme = (nextTheme: Theme) => {
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    window.dispatchEvent(new Event(THEME_CHANGED_EVENT));
  };

  const isDark = theme === "dark";
  const githubProfileUrl = `https://github.com/${githubUsername}`;
  const githubCalendarUrl = `https://ghchart.rshah.org/${
    isDark ? "42F527" : "0f766e"
  }/${githubUsername}`;

  useEffect(() => {
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

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
      <ThemeToggle isDark={isDark} theme={theme} onThemeChange={setTheme} />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-12 md:px-10 md:py-16">
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
