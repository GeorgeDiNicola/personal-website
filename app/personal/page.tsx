"use client";

import { ChessGamesSection } from "@/components/personal/ChessGamesSection";
import { OpenLibraryBooksSection } from "@/components/personal/OpenLibraryBooksSection";
import { OutdoorPhotographySection } from "@/components/personal/OutdoorPhotographySection";
import { PersonalHeroSection } from "@/components/personal/PersonalHeroSection";
import { AmbientPointerGlow } from "@/components/portfolio/AmbientPointerGlow";
import { BackToTopButton } from "@/components/portfolio/BackToTopButton";
import { ParallaxBackground } from "@/components/portfolio/ParallaxBackground";
import { ScrollProgressBar } from "@/components/portfolio/ScrollProgressBar";
import { SiteNavbar } from "@/components/portfolio/SiteNavbar";
import { useTextColorPreference } from "@/components/portfolio/useTextColorPreference";
import { useThemePreference } from "@/components/portfolio/useThemePreference";

const OPEN_LIBRARY_USERNAME = process.env.NEXT_PUBLIC_OPEN_LIBRARY_USERNAME?.trim() || "george3d";

export default function PersonalPage() {
  const { theme, setTheme, isDark } = useThemePreference();
  const { textColor, setTextColor } = useTextColorPreference(theme);

  return (
    <main className="portfolio-page relative">
      <ParallaxBackground isDark={isDark} />
      <AmbientPointerGlow />
      <ScrollProgressBar />
      <SiteNavbar
        isDark={isDark}
        theme={theme}
        onThemeChange={setTheme}
        textColor={textColor}
        onTextColorChange={setTextColor}
      />

      <div className="portfolio-content portfolio-content-spaced">
        <PersonalHeroSection />

        <OutdoorPhotographySection isDark={isDark} />
        <ChessGamesSection isDark={isDark} />
        <OpenLibraryBooksSection isDark={isDark} username={OPEN_LIBRARY_USERNAME} />
      </div>

      <BackToTopButton />
    </main>
  );
}
