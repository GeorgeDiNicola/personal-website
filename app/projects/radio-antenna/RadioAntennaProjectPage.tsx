"use client";

import Image from "next/image";
import Link from "next/link";

import { SectionCard } from "@/components/personal/SectionCard";
import { BackToTopButton } from "@/components/portfolio/BackToTopButton";
import { ScrollProgressBar } from "@/components/portfolio/ScrollProgressBar";
import { SiteNavbar } from "@/components/portfolio/SiteNavbar";
import { useTextColorPreference } from "@/components/portfolio/useTextColorPreference";
import { useThemePreference } from "@/components/portfolio/useThemePreference";

const photos = [
  {
    src: "/images/projects/diy-radio-antenna-1.webp",
    alt: "Homemade Yagi antenna with metal elements attached to a wooden boom, mounted on a tripod beside a window",
    caption: "The antenna build"
  },
  {
    src: "/images/projects/diy-radio-antenna-2.webp",
    alt: "The antenna beside a desk with SDR software displaying a radio spectrum and waterfall on the monitor",
    caption: "The software-defined radio setup"
  }
];

export function RadioAntennaProjectPage() {
  const { theme, setTheme, isDark } = useThemePreference();
  const { textColor, setTextColor } = useTextColorPreference(theme);

  return (
    <main className="portfolio-page relative">
      <ScrollProgressBar />
      <SiteNavbar
        isDark={isDark}
        theme={theme}
        onThemeChange={setTheme}
        textColor={textColor}
        onTextColorChange={setTextColor}
      />

      <div id="main-content" tabIndex={-1} className="portfolio-content portfolio-content-spaced">
        <header className="portfolio-hero-surface">
          <Link href="/#projects" className="portfolio-action mb-6 px-4 py-2 text-sm">
            <span aria-hidden="true" className="site-text-static">←</span>
            <span className="site-text-static">Back to projects</span>
          </Link>
          <p className="portfolio-eyebrow site-text-static">Software-defined radio · Hardware</p>
          <h1 className="mt-3">
            DIY Radio Antenna
          </h1>
          <p className="portfolio-copy mt-4 max-w-2xl">
            I built a radio antenna from wood, bronze, coaxial cable, and solder,
            and used software-defined radio (SDR) to receive and explore amateur
            radio signals on my computer. The build follows Diana Eng’s Yagi
            antenna project featured in Make: magazine.
          </p>
        </header>

        <SectionCard
          id="antenna-sdr"
          title="Receiving signals with software-defined radio"
          isDark={isDark}
        >
          <div className="portfolio-copy mx-auto max-w-3xl space-y-4">
            <p>
              The antenna feeds an SDR receiver, which turns radio signals into
              digital samples for the computer to process. Software handles
              filtering and demodulation and lets me tune across frequencies.
            </p>
          </div>
        </SectionCard>

        <SectionCard id="antenna-photos" ariaLabel="Antenna build photos" isDark={isDark}>
          <div className="grid gap-4 sm:grid-cols-2">
            {photos.map((photo) => (
              <figure key={photo.src} className="portfolio-inset overflow-hidden">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={1200}
                  height={900}
                  sizes="(max-width: 639px) 100vw, (max-width: 1152px) 50vw, 520px"
                  className="h-auto w-full"
                />
                <figcaption className="portfolio-copy px-4 py-3 text-sm">
                  {photo.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </SectionCard>

        <SectionCard id="antenna-credit" title="Project inspiration" isDark={isDark}>
          <p className="portfolio-copy mx-auto max-w-3xl text-center">
            Credit to Diana Eng for the Yagi antenna project in MAKE Volume 24.
            Her project provided the guide for my build.
          </p>
          <div className="mt-5 flex justify-center">
            <a
              href="https://makezine.com/article/science/diana-engs-yagi-antenna-project-in/"
              target="_blank"
              rel="noopener noreferrer"
              className="portfolio-action px-4 py-2 text-sm"
              aria-label="Read the Make: article (opens in a new tab)"
            >
              <span className="site-text-static">Read the Make: article</span>
              <span aria-hidden="true" className="site-text-static">↗</span>
            </a>
          </div>
        </SectionCard>
      </div>

      <BackToTopButton />
    </main>
  );
}
