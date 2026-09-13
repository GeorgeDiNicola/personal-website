"use client";

import Image from "next/image";

import styles from "./motion/HomepageIntro.module.css";

const heroSignalRows = [
  ["Current", "Backend Systems & Data Engineering"],
  ["Previous", "Core Platform & Identity Systems"],
] as const;

export function HeroSection() {
  return (
    <section className="relative" aria-labelledby="home-identity">
      <div className={`portfolio-hero-surface mx-auto max-w-4xl ${styles.hero}`}>
        <div className={`portfolio-hero-surface ${styles.frame}`} aria-hidden="true" />
        <div
          className="mx-auto grid max-w-4xl items-center gap-7 md:grid-cols-[minmax(0,1.1fr)_minmax(14rem,0.9fr)]"
        >
          <div className="order-2 grid gap-5 text-center md:order-1 md:text-left">
            <div className={styles.identity}>
              <p className={`portfolio-eyebrow site-text-static ${styles.eyebrow}`}>
                Professional Portfolio
              </p>
              <h1 id="home-identity" className={`mt-3 text-4xl font-semibold leading-tight tracking-tight md:text-5xl ${styles.nameMask}`}>
                <span className={`site-text-static ${styles.name}`}>George DiNicola</span>
              </h1>
              <div className={styles.rule} aria-hidden="true" data-intro-finish />
            </div>

            <div className={styles.roles}>
              <div className="flex flex-wrap justify-center gap-2 md:justify-start">
                <span className="portfolio-chip site-text-static">
                  Software Engineer
                </span>
                <span className="portfolio-chip site-text-static">
                  Data Engineer
                </span>
              </div>
            </div>

            <div
              className={`portfolio-hero-console p-4 md:p-5 ${styles.details}`}
            >
              {heroSignalRows.map(([key, value]) => (
                <div key={key} className="portfolio-console-row">
                  <span className="portfolio-console-key site-text-static">
                    {key}
                  </span>
                  <span className="text-left sm:text-right">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div
            className={`relative order-1 mx-auto grid aspect-square w-full max-w-[15rem] place-items-center md:order-2 md:max-w-[18rem] ${styles.portrait}`}
          >
            <div className="portfolio-hero-orbit" aria-hidden="true" />
            <div
              className="relative aspect-square w-[70%] md:w-[75%]"
            >
              <div
                className="absolute -inset-2 rounded-full bg-[conic-gradient(from_210deg,var(--accent),transparent_35%,var(--accent-two),transparent_70%,var(--accent))] opacity-70 blur-sm"
              />
              <div className="relative h-full w-full overflow-hidden rounded-full border-2 border-[var(--surface-strong)] shadow-[0_18px_42px_rgba(0,0,0,0.22)]">
                <Image
                  src="/me-thumbnail.webp"
                  alt="Portrait of George DiNicola"
                  fill
                  sizes="(min-width: 768px) 216px, 168px"
                  priority
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
