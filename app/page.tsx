"use client";

import { BackToTopButton } from "@/components/portfolio/BackToTopButton";
import { EducationSection } from "@/components/portfolio/EducationSection";
import { GitHubActivitySection } from "@/components/portfolio/GitHubActivitySection";
import { HeroSection } from "@/components/portfolio/HeroSection";
import { ProjectsSection } from "@/components/portfolio/ProjectsSection";
import { ScrollProgressBar } from "@/components/portfolio/ScrollProgressBar";
import { SiteNavbar } from "@/components/portfolio/SiteNavbar";
import { SkillsSection } from "@/components/portfolio/SkillsSection";
import { WorkHistorySection } from "@/components/portfolio/WorkHistorySection";
import introStyles from "@/components/portfolio/motion/HomepageIntro.module.css";
import {
  githubUsername,
  projects,
  schools,
  skills,
  workHistory
} from "@/components/portfolio/data";
import { useTextColorPreference } from "@/components/portfolio/useTextColorPreference";
import { useThemePreference } from "@/components/portfolio/useThemePreference";

export default function HomePage() {
  const { theme, setTheme, isDark } = useThemePreference();
  const { textColor, setTextColor } = useTextColorPreference(theme);
  const githubProfileUrl = `https://github.com/${githubUsername}`;
  const githubCalendarUrl = `https://ghchart.rshah.org/${
    isDark ? "42F527" : "0f766e"
  }/${githubUsername}`;

  return (
    <main className={`portfolio-page relative ${introStyles.page}`}>
      <ScrollProgressBar />
      <SiteNavbar
        isDark={isDark}
        theme={theme}
        onThemeChange={setTheme}
        textColor={textColor}
        onTextColorChange={setTextColor}
      />

      <div id="main-content" tabIndex={-1} className="portfolio-content">
        <HeroSection />
        <div className={introStyles.continuation}>
          <EducationSection schools={schools} />
          <WorkHistorySection workHistory={workHistory} />
          <SkillsSection skills={skills} />
          <ProjectsSection projects={projects} />
          <GitHubActivitySection
            githubUsername={githubUsername}
            githubProfileUrl={githubProfileUrl}
            githubCalendarUrl={githubCalendarUrl}
          />
        </div>
      </div>

      <BackToTopButton />
    </main>
  );
}
