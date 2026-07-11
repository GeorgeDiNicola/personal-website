"use client";

import { useEffect, useRef, useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { Theme } from "@/components/portfolio/types";
import type { TextColor } from "@/components/portfolio/useTextColorPreference";

type SiteNavbarProps = {
  isDark: boolean;
  theme: Theme;
  onThemeChange: (theme: "light" | "dark") => void;
  textColor: TextColor;
  onTextColorChange: (color: TextColor) => void;
};

const customTextColorOptions: Array<{
  value: Exclude<TextColor, "default">;
  label: string;
  color: string;
}> = [
  { value: "purple", label: "Purple", color: "#a855f7" },
  { value: "yellow", label: "Yellow", color: "#fde047" },
  { value: "pink", label: "Pink", color: "#f472b6" },
  { value: "green", label: "Green", color: "#4ade80" },
  { value: "blue", label: "Blue", color: "#60a5fa" }
];

export function SiteNavbar({
  isDark,
  theme,
  onThemeChange,
  textColor,
  onTextColorChange
}: SiteNavbarProps) {
  const pathname = usePathname();
  const [isPaletteOpen, setPaletteOpen] = useState(false);
  const paletteRef = useRef<HTMLDivElement>(null);
  const isPersonalRoute = /\/personal(?:\/|$)/.test(pathname);
  const isDataVisualizationsRoute = /\/data-visualizations(?:\/|$)/.test(pathname);
  const defaultModeColor = isDark ? "#f1f5f9" : "#0f172a";

  const tabs = [
    {
      href: "/",
      label: "Professional",
      compactLabel: "Work",
      active: !isPersonalRoute && !isDataVisualizationsRoute
    },
    {
      href: "/personal",
      label: "Personal",
      compactLabel: "Personal",
      active: isPersonalRoute
    },
    {
      href: "/data-visualizations",
      label: "Dashboards",
      compactLabel: "Dashboards",
      active: isDataVisualizationsRoute
    }
  ];
  const textColorOptions: Array<{ value: TextColor; label: string; color: string }> = [
    {
      value: "default",
      label: isDark ? "Mode default (dark)" : "Mode default (light)",
      color: defaultModeColor
    },
    ...customTextColorOptions
  ];
  const selectedColorOption =
    textColorOptions.find((option) => option.value === textColor) ??
    textColorOptions[0];

  useEffect(() => {
    if (!isPaletteOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!paletteRef.current?.contains(event.target as Node)) {
        setPaletteOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPaletteOpen(false);
    };

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isPaletteOpen]);

  return (
    <header className="sticky top-0 z-40 w-full px-3 pt-3 md:px-5 md:pt-4">
      <div
        className="mx-auto flex w-full max-w-6xl items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-2 py-1.5 shadow-[var(--shadow-card)] backdrop-blur-2xl md:px-3"
      >
        <nav aria-label="Main" className="flex min-w-0 flex-1 gap-1">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={tab.active ? "page" : undefined}
              className={`relative flex-1 overflow-hidden rounded-xl px-2 py-2 text-center text-xs font-semibold tracking-wide transition-all duration-200 sm:text-sm md:px-4 md:text-base ${
                tab.active
                  ? "bg-[var(--accent-soft)] text-[var(--accent-strong)] shadow-[inset_0_1px_0_var(--highlight)]"
                  : isDark
                    ? "text-slate-300 hover:bg-white/[0.04] hover:text-slate-100"
                    : "text-slate-700 hover:bg-slate-900/[0.04] hover:text-slate-950"
              }`}
            >
              {tab.active ? (
                <span
                  aria-hidden="true"
                  className="absolute inset-x-3 bottom-0 h-px bg-[linear-gradient(90deg,transparent,var(--accent),transparent)]"
                />
              ) : null}
              <span className="md:hidden">{tab.compactLabel}</span>
              <span className="hidden md:inline">{tab.label}</span>
            </Link>
          ))}
        </nav>
        <div className="relative shrink-0" ref={paletteRef}>
          <button
            type="button"
            onClick={() => setPaletteOpen((open) => !open)}
            aria-haspopup="menu"
            aria-expanded={isPaletteOpen}
            aria-label="Open text color palette"
            title="Open text color palette"
            className="portfolio-icon-button inline-flex h-10 w-10 items-center justify-center rounded-full"
          >
            <span
              className="block h-4 w-4 rounded-full border border-black/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.55)]"
              style={{ backgroundColor: selectedColorOption.color }}
            />
          </button>
          <div
            role="menu"
            aria-label="Website text color"
            aria-hidden={!isPaletteOpen}
            className={`absolute right-0 top-full z-50 mt-2 flex origin-top-right flex-col gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] p-1.5 shadow-[var(--shadow-card)] backdrop-blur-xl transition-all duration-200 ease-out ${
              isPaletteOpen
                ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
                : "pointer-events-none -translate-y-1 scale-95 opacity-0"
            }`}
          >
            {textColorOptions.map((option) => {
              const isSelected = option.value === textColor;

              return (
                <button
                  key={option.value}
                  type="button"
                  role="menuitemradio"
                  aria-checked={isSelected}
                  onClick={() => {
                    onTextColorChange(option.value);
                    setPaletteOpen(false);
                  }}
                  tabIndex={isPaletteOpen ? 0 : -1}
                  className={`inline-flex h-7 w-7 items-center justify-center rounded-full transition ${
                    isSelected
                      ? "ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-[var(--surface-strong)]"
                      : "opacity-90 hover:scale-105 hover:opacity-100"
                  }`}
                  aria-label={option.label}
                  title={option.label}
                >
                  <span
                    className="block h-4 w-4 rounded-full border border-black/30"
                    style={{ backgroundColor: option.color }}
                  />
                </button>
              );
            })}
          </div>
        </div>
        <button
          type="button"
          onClick={() => onThemeChange(theme === "dark" ? "light" : "dark")}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          className="portfolio-icon-button inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
        >
          {theme === "dark" ? (
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2" />
              <path d="M12 20v2" />
              <path d="m4.93 4.93 1.41 1.41" />
              <path d="m17.66 17.66 1.41 1.41" />
              <path d="M2 12h2" />
              <path d="M20 12h2" />
              <path d="m6.34 17.66-1.41 1.41" />
              <path d="m19.07 4.93-1.41 1.41" />
            </svg>
          ) : (
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 3a6 6 0 0 0 9 7.5A8.5 8.5 0 1 1 12 3Z" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}
