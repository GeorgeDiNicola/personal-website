"use client";

import type { ComponentType, SVGProps } from "react";

type PersonalInterest = {
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const personalInterests: PersonalInterest[] = [
  { label: "Mountains", Icon: MountainIcon },
  { label: "Trees", Icon: TreesIcon },
  { label: "Photography", Icon: CameraIcon },
  { label: "Chess", Icon: ChessKnightIcon },
  { label: "Books", Icon: BooksIcon }
];

export function PersonalHeroSection() {
  return (
    <section className="portfolio-hero-surface">
      <div className="text-center">
        <p className="portfolio-eyebrow site-text-static">
          Personal
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">
          Personal Life
        </h1>
        <p className="portfolio-copy mx-auto mt-4 max-w-2xl text-base md:text-lg">
          A collection of my interests outside of work
        </p>

        <div
          className="mx-auto mt-7 flex max-w-md flex-wrap items-center justify-center gap-3"
          aria-label="Personal interests"
        >
          {personalInterests.map(({ label, Icon }) => (
            <div
              key={label}
              className="portfolio-inset grid h-14 w-14 place-items-center rounded-2xl bg-[var(--surface-muted)] text-[var(--accent-strong)] shadow-[var(--shadow-card)]"
              title={label}
            >
              <Icon className="h-7 w-7" />
              <span className="sr-only">{label}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <span className="portfolio-chip site-text-static">
            Outdoors
          </span>
          <span className="portfolio-chip site-text-static">
            Chess
          </span>
          <span className="portfolio-chip site-text-static">
            Reading
          </span>
        </div>
      </div>
    </section>
  );
}

function MountainIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
      aria-hidden="true"
      {...props}
    >
      <path d="M3 18.5 9.2 7.5l4.1 6.6 2.1-3.4 5.6 7.8H3Z" />
      <path d="m7.3 18.5 3-5.2 2.1 3.2" />
    </svg>
  );
}

function TreesIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
      aria-hidden="true"
      {...props}
    >
      <path d="M7.5 19v-3" />
      <path d="M16.5 19v-4" />
      <path d="M4.2 15.5 7.5 5l3.3 10.5H4.2Z" />
      <path d="M12.6 14.5 16.5 4l3.9 10.5h-7.8Z" />
      <path d="M5 19h14" />
    </svg>
  );
}

function ChessKnightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
      aria-hidden="true"
      {...props}
    >
      <path d="M7 20h10" />
      <path d="M8.5 17.5h7" />
      <path d="M9.5 17.5c.3-2.6 1.1-4.4 2.6-5.8l-3.4.1c-.7 0-1.1-.8-.7-1.4l3.2-5.1c.4-.6 1.3-.7 1.8-.1l3.4 3.8c1.3 1.4 1.7 3.3 1.2 5.1l-.9 3.4" />
      <path d="M12.1 5.4v3.1" />
      <path d="M12.8 9.2h.1" />
    </svg>
  );
}

function BooksIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
      aria-hidden="true"
      {...props}
    >
      <path d="M5 5.5c0-.8.7-1.5 1.5-1.5H18v14H6.5C5.7 18 5 17.3 5 16.5v-11Z" />
      <path d="M8.5 4v14" />
      <path d="M18 7.5h1.2c.7 0 1.3.6 1.3 1.3v10.7H8.1c-1.7 0-3.1-1.4-3.1-3.1" />
      <path d="M11 8h4" />
      <path d="M11 11h3" />
    </svg>
  );
}

function CameraIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
      aria-hidden="true"
      {...props}
    >
      <path d="M7.5 7.5 9.2 5h5.6l1.7 2.5H19c1.1 0 2 .9 2 2v8c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2v-8c0-1.1.9-2 2-2h2.5Z" />
      <circle cx="12" cy="13.2" r="3.2" />
      <path d="M17.5 10h.1" />
    </svg>
  );
}
