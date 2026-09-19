"use client";

import Image from "next/image";

import styles from "./motion/HomepageIntro.module.css";

const heroSignalRows = [
  ["Current", "Backend Systems & Data Engineering"],
  ["Previous", "Core Platform & Identity Systems"],
] as const;

export function HeroSection() {
  return (
    <section className={`portfolio-home-hero ${styles.hero}`} aria-labelledby="home-identity">
      <div className={styles.introTrace} aria-hidden="true" data-intro-finish />
      <div className="portfolio-hero-identity">
        <div className={styles.identity}>
          <p className={`portfolio-eyebrow site-text-static ${styles.eyebrow}`}>
            Professional Portfolio
          </p>
          <h1 id="home-identity" className={`mt-6 ${styles.nameMask}`}>
            <span className={`site-text-static ${styles.nameLine}`}>George</span>
            {" "}
            <span className={`site-text-static ${styles.nameLine}`}>DiNicola</span>
          </h1>
          <div className={styles.rule} aria-hidden="true" />
        </div>
        <div className={`portfolio-hero-roles ${styles.roles}`}>
          <span className="site-text-static">Software Engineer</span>
          <span className="site-text-static">Data Engineer</span>
        </div>
        <div className={`portfolio-hero-console ${styles.details}`}>
          {heroSignalRows.map(([key, value]) => (
            <div key={key} className="portfolio-console-row">
              <span className="portfolio-console-key site-text-static">{key}</span>
              <span>{value}</span>
            </div>
          ))}
        </div>
      </div>
      <div className={`portfolio-portrait ${styles.portrait}`}>
        <div className={`portfolio-engineering-system ${styles.engineeringSystem}`} aria-hidden="true">
          <svg className="portfolio-circuit-board" viewBox="0 0 400 400">
            <g className="portfolio-circuit-traces">
              <path d="M200 66V24h42V4" />
              <path d="M200 334v42h-42v20" />
              <path d="M103 103 72 72H34V38" />
              <path d="m297 103 31-31h38V38" />
              <path d="m103 297-31 31H34v34" />
              <path d="m297 297 31 31h38v34" />
            </g>
            <g className="portfolio-circuit-current">
              <path pathLength="1" d="M200 66V24h42V4" />
              <path pathLength="1" d="M200 334v42h-42v20" />
              <path pathLength="1" d="M103 103 72 72H34V38" />
              <path pathLength="1" d="m297 103 31-31h38V38" />
              <path pathLength="1" d="m103 297-31 31H34v34" />
              <path pathLength="1" d="m297 297 31 31h38v34" />
            </g>
            <g className="portfolio-circuit-nodes">
              <circle cx="242" cy="4" r="4" />
              <circle cx="158" cy="396" r="4" />
              <circle cx="34" cy="38" r="4" />
              <circle cx="366" cy="38" r="4" />
              <circle cx="34" cy="362" r="4" />
              <circle cx="366" cy="362" r="4" />
            </g>
            <g className="portfolio-radio-waves portfolio-radio-waves-left">
              <path d="M58 160q-30 40 0 80" />
              <path d="M42 140q-48 60 0 120" />
            </g>
            <g className="portfolio-radio-waves portfolio-radio-waves-right">
              <path d="M342 160q30 40 0 80" />
              <path d="M358 140q48 60 0 120" />
            </g>
            <g transform="translate(120 55)">
              <g className="portfolio-gear portfolio-gear-primary">
                <circle r="12" />
                <circle r="4" />
                <path d="M0-19v7M0 12v7M-19 0h7M12 0h7M-13.5-13.5l5 5M8.5 8.5l5 5M13.5-13.5l-5 5M-8.5 8.5l-5 5" />
              </g>
            </g>
            <g transform="translate(280 345)">
              <g className="portfolio-gear portfolio-gear-secondary">
                <circle r="9" />
                <circle r="3" />
                <path d="M0-15v6M0 9v6M-15 0h6M9 0h6M-10.5-10.5l4.25 4.25M6.25 6.25l4.25 4.25M10.5-10.5l-4.25 4.25M-6.25 6.25l-4.25 4.25" />
              </g>
            </g>
          </svg>
        </div>
        <div className={`portfolio-portrait-image ${styles.portraitImage}`}>
          <Image
            src="/me-thumbnail.webp"
            alt="Portrait of George DiNicola"
            fill
            sizes="(min-width: 1280px) 340px, (min-width: 768px) 30vw, 177px"
            priority
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
