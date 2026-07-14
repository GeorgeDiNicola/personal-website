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

type NavigationTab = {
  href: string;
  label: string;
  compactLabel: string;
  icon: "work" | "personal" | "dashboards";
  active: boolean;
};

export function SiteNavbar({
  isDark,
  theme,
  onThemeChange,
  textColor,
  onTextColorChange
}: SiteNavbarProps) {
  const pathname = usePathname();
  const [isPaletteOpen, setPaletteOpen] = useState(false);
  const [isNavbarHidden, setNavbarHidden] = useState(false);
  const paletteRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const isPaletteOpenRef = useRef(false);
  const lastScrollYRef = useRef(0);
  const isPersonalRoute = /\/personal(?:\/|$)/.test(pathname);
  const isDataVisualizationsRoute = /\/data-visualizations(?:\/|$)/.test(pathname);
  const defaultModeColor = isDark ? "#f1f5f9" : "#0f172a";

  const tabs: NavigationTab[] = [
    {
      href: "/",
      label: "Professional",
      compactLabel: "Work",
      icon: "work",
      active: !isPersonalRoute && !isDataVisualizationsRoute
    },
    {
      href: "/personal",
      label: "Personal",
      compactLabel: "Personal",
      icon: "personal",
      active: isPersonalRoute
    },
    {
      href: "/data-visualizations",
      label: "Dashboards",
      compactLabel: "Data",
      icon: "dashboards",
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

  useEffect(() => {
    isPaletteOpenRef.current = isPaletteOpen;
  }, [isPaletteOpen]);

  useEffect(() => {
    const scrollActivationDistance = 96;
    const scrollDeadZone = 6;

    const updateNavbarVisibility = () => {
      frameRef.current = null;
      const currentScrollY = window.scrollY;

      if (isPaletteOpenRef.current) {
        lastScrollYRef.current = currentScrollY;
        return;
      }

      const scrollDelta = currentScrollY - lastScrollYRef.current;
      const isScrollingDown = scrollDelta > scrollDeadZone;
      const isScrollingUp = scrollDelta < -scrollDeadZone;

      if (currentScrollY <= scrollActivationDistance || isScrollingUp) {
        setNavbarHidden(false);
      } else if (isScrollingDown) {
        setNavbarHidden(true);
      }

      lastScrollYRef.current = currentScrollY;
    };

    const onScroll = () => {
      if (frameRef.current === null) {
        frameRef.current = window.requestAnimationFrame(updateNavbarVisibility);
      }
    };

    lastScrollYRef.current = window.scrollY;
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);

      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full px-3 pt-3 transition duration-300 ease-[var(--ease-out-soft)] md:px-5 md:pt-4 ${
        isNavbarHidden ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
      }`}
      onFocusCapture={() => setNavbarHidden(false)}
    >
      <div
        className="portfolio-nav-shell mx-auto flex w-full max-w-6xl items-center gap-2 rounded-2xl px-2 py-1.5 md:px-3"
      >
        <Link
          href="/"
          aria-label="Go to professional homepage"
          className="portfolio-nav-brand site-text-static hidden shrink-0 items-center gap-2 md:inline-flex"
        >
          <span className="portfolio-nav-brand-mark" aria-hidden="true">
            GD
          </span>
        </Link>

        <nav aria-label="Main" className="portfolio-nav-tabs flex min-w-0 flex-1 gap-1">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={tab.active ? "page" : undefined}
              className={`portfolio-nav-tab site-text-static ${
                tab.active ? "portfolio-nav-tab-active" : ""
              }`}
            >
              {tab.active ? (
                <span
                  aria-hidden="true"
                  className="portfolio-nav-active-beam"
                />
              ) : null}
              <span className="portfolio-nav-tab-icon" aria-hidden="true">
                <NavIcon icon={tab.icon} />
              </span>
              <span className="md:hidden">{tab.compactLabel}</span>
              <span className="hidden md:inline">{tab.label}</span>
            </Link>
          ))}
        </nav>

        <div className="portfolio-nav-actions">
          <span
            className={`portfolio-nav-mode site-text-static hidden lg:inline-flex ${
              isDark ? "portfolio-nav-mode-dark" : ""
            }`}
          >
            {isDark ? "Dark" : "Light"}
          </span>
          <button
            type="button"
            onClick={() => onThemeChange(theme === "dark" ? "light" : "dark")}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="portfolio-icon-button portfolio-nav-control inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
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
          <div className="relative shrink-0" ref={paletteRef}>
            <button
              type="button"
              onClick={() => {
                setNavbarHidden(false);
                setPaletteOpen((open) => !open);
              }}
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
        </div>
      </div>
    </header>
  );
}

function NavIcon({ icon }: { icon: NavigationTab["icon"] }) {
  if (icon === "personal") {
    return (
      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M8 8.6c2 0 3.6-1.5 3.6-3.4S10 1.8 8 1.8 4.4 3.3 4.4 5.2 6 8.6 8 8.6Z" />
        <path d="M2.8 14.1c.6-2.2 2.6-3.7 5.2-3.7s4.6 1.5 5.2 3.7" />
      </svg>
    );
  }

  if (icon === "dashboards") {
    return (
      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M2.3 13.7V2.3h11.4v11.4H2.3Z" />
        <path d="M5 10.6V7.2" />
        <path d="M8 10.6V4.8" />
        <path d="M11 10.6V6.1" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2.5 8.4 8 2.6l5.5 5.8" />
      <path d="M4.2 7.1v6.1h7.6V7.1" />
      <path d="M6.7 13.2V9.5h2.6v3.7" />
    </svg>
  );
}
