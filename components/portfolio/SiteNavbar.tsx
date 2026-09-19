"use client";

import { useEffect, useRef, useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { Theme } from "@/components/portfolio/types";
import {
  resolveTextColorValue,
  TEXT_COLOR_PALETTE,
  type TextColor
} from "@/components/portfolio/useTextColorPreference";

type SiteNavbarProps = {
  isDark: boolean;
  theme: Theme;
  onThemeChange: (theme: "light" | "dark") => void;
  textColor: TextColor;
  onTextColorChange: (color: TextColor) => void;
};

type NavigationTab = {
  href: string;
  label: string;
  icon: "work" | "personal";
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
  const paletteTriggerRef = useRef<HTMLButtonElement>(null);
  const frameRef = useRef<number | null>(null);
  const isPaletteOpenRef = useRef(false);
  const lastScrollYRef = useRef(0);
  const isPersonalRoute = /\/personal(?:\/|$)/.test(pathname);

  const tabs: NavigationTab[] = [
    {
      href: "/",
      label: "Professional",
      icon: "work",
      active: !isPersonalRoute
    },
    {
      href: "/personal",
      label: "Personal",
      icon: "personal",
      active: isPersonalRoute
    }
  ];
  const textColorOptions: Array<{ value: TextColor; label: string; color: string }> = [
    {
      value: "default",
      label: isDark ? "Mode default (dark)" : "Mode default (light)",
      color: resolveTextColorValue("default", theme)
    },
    ...Object.entries(TEXT_COLOR_PALETTE).map(([value, option]) => ({
      value: value as Exclude<TextColor, "default">,
      label: option.label,
      color: option[theme]
    }))
  ];
  const selectedColorOption =
    textColorOptions.find((option) => option.value === textColor) ??
    textColorOptions[0];

  useEffect(() => {
    if (!isPaletteOpen) return;

    paletteRef.current
      ?.querySelector<HTMLButtonElement>('[role="menuitemradio"][aria-checked="true"]')
      ?.focus();

    const handlePointerDown = (event: MouseEvent) => {
      if (!paletteRef.current?.contains(event.target as Node)) {
        setPaletteOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setPaletteOpen(false);
        paletteTriggerRef.current?.focus();
      }
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
      className={`site-header ${
        isNavbarHidden ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
      }`}
      onFocusCapture={() => setNavbarHidden(false)}
    >
      <div
        className="portfolio-nav-shell"
      >
        <Link
          href="/"
          aria-label="Go to professional homepage"
          className="portfolio-nav-brand site-text-static inline-flex shrink-0 items-center"
        >
          <span className="portfolio-nav-brand-mark" aria-hidden="true">
            GD
          </span>
        </Link>

        <nav aria-label="Main" className="portfolio-nav-tabs min-w-0">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={tab.active ? "page" : undefined}
              className={`portfolio-nav-tab site-text-static ${
                tab.active ? "portfolio-nav-tab-active" : ""
              }`}
            >
              {tab.active ? <span className="portfolio-nav-active-beam" aria-hidden="true" /> : null}
              <span className="portfolio-nav-tab-icon" aria-hidden="true">
                <NavIcon icon={tab.icon} />
              </span>
              <span>{tab.label}</span>
            </Link>
          ))}
        </nav>

        <div className="portfolio-nav-actions">
          <button
            type="button"
            onClick={() => onThemeChange(theme === "dark" ? "light" : "dark")}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="portfolio-icon-button portfolio-nav-button portfolio-nav-control"
          >
            <span className="portfolio-nav-button-icon" aria-hidden="true">
              {theme === "dark" ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3a6 6 0 0 0 9 7.5A8.5 8.5 0 1 1 12 3Z" />
                </svg>
              )}
            </span>
            <span className="portfolio-nav-button-label">{theme === "dark" ? "Light" : "Dark"}</span>
          </button>
          <div
            className="relative shrink-0"
            ref={paletteRef}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) setPaletteOpen(false);
            }}
          >
            <button
              ref={paletteTriggerRef}
              type="button"
              onClick={() => {
                setNavbarHidden(false);
                setPaletteOpen((open) => !open);
              }}
              aria-haspopup="menu"
              aria-expanded={isPaletteOpen}
              aria-label="Open body text color palette"
              title="Open body text color palette"
              className="portfolio-icon-button portfolio-nav-button"
            >
              <span
                className="portfolio-color-swatch"
                style={{ backgroundColor: selectedColorOption.color }}
              />
              <span className="portfolio-nav-button-label">Text color</span>
            </button>
            <div
              role="menu"
              aria-label="Body text color"
              aria-hidden={!isPaletteOpen}
              onKeyDown={(event) => {
                const keys = ["ArrowDown", "ArrowUp", "Home", "End"];
                if (!keys.includes(event.key)) return;
                event.preventDefault();
                const options = Array.from(
                  event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]')
                );
                const currentIndex = options.indexOf(document.activeElement as HTMLButtonElement);
                const nextIndex = event.key === "Home" ? 0
                  : event.key === "End" ? options.length - 1
                  : (currentIndex + (event.key === "ArrowDown" ? 1 : -1) + options.length) % options.length;
                options[nextIndex]?.focus();
              }}
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
                      paletteTriggerRef.current?.focus();
                    }}
                    tabIndex={isPaletteOpen ? 0 : -1}
                    className={`inline-flex h-11 w-11 items-center justify-center rounded-full transition ${
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

  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2.5 8.4 8 2.6l5.5 5.8" />
      <path d="M4.2 7.1v6.1h7.6V7.1" />
      <path d="M6.7 13.2V9.5h2.6v3.7" />
    </svg>
  );
}
