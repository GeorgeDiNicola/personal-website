"use client";

import { BackToTopButton } from "@/components/portfolio/BackToTopButton";
import { EducationSection } from "@/components/portfolio/EducationSection";
import { GitHubActivitySection } from "@/components/portfolio/GitHubActivitySection";
import { HeroSection } from "@/components/portfolio/HeroSection";
import { ParallaxBackground } from "@/components/portfolio/ParallaxBackground";
import { ProjectsSection } from "@/components/portfolio/ProjectsSection";
import { ScrollProgressBar } from "@/components/portfolio/ScrollProgressBar";
import { SiteNavbar } from "@/components/portfolio/SiteNavbar";
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
import { useThemePreference } from "@/components/portfolio/useThemePreference";

export default function HomePage() {
  const { theme, setTheme, isDark } = useThemePreference();
  const githubProfileUrl = `https://github.com/${githubUsername}`;
  const githubCalendarUrl = `https://ghchart.rshah.org/${
    isDark ? "42F527" : "0f766e"
  }/${githubUsername}`;

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
      <SiteNavbar isDark={isDark} />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-12 pt-8 md:px-10 md:pb-16 md:pt-10">
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
