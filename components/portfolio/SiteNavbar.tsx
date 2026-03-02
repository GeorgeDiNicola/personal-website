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
  const defaultModeColor = isDark ? "#f1f5f9" : "#0f172a";

  const tabs = [
    { href: "/", label: "Professional", active: !isPersonalRoute },
    {
      href: "/personal",
      label: "Personal",
      active: isPersonalRoute
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
    <header className="relative z-40 w-full pt-3 md:pt-4">
      <div
        className={`flex w-full items-center gap-2 border px-2 py-1.5 backdrop-blur-xl md:px-3 ${
          isDark
            ? "border-slate-700/80 bg-slate-900/70"
            : "border-slate-200 bg-white/80"
        }`}
      >
        <nav aria-label="Main" className="flex min-w-0 flex-1 gap-1">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex-1 rounded-xl px-3 py-2 text-center text-sm font-semibold tracking-wide transition-colors md:px-4 md:text-base ${
                tab.active
                  ? isDark
                    ? "bg-cyan-400/20 text-cyan-200"
                    : "bg-cyan-100 text-cyan-800"
                  : isDark
                    ? "text-slate-300 hover:bg-slate-800/70"
                    : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              {tab.label}
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
            className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${
              isDark
                ? "border-slate-600 bg-slate-800"
                : "border-slate-300 bg-slate-100"
            }`}
          >
            <span
              className="block h-4 w-4 rounded-full border border-black/30"
              style={{ backgroundColor: selectedColorOption.color }}
            />
          </button>
          <div
            role="menu"
            aria-label="Website text color"
            aria-hidden={!isPaletteOpen}
            className={`absolute right-0 top-full z-50 mt-2 flex origin-top-right flex-col gap-1.5 rounded-xl border p-1.5 backdrop-blur-xl transition-all duration-200 ease-out ${
              isDark
                ? "border-slate-600 bg-slate-900/95"
                : "border-slate-300 bg-white/95"
            } ${
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
                      ? isDark
                        ? "ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-900"
                        : "ring-2 ring-cyan-500 ring-offset-2 ring-offset-white"
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
          className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-lg transition-colors ${
            isDark
              ? "border-slate-600 bg-slate-800"
              : "border-slate-300 bg-slate-100"
          }`}
        >
          {theme === "dark" ? "☀" : "☾"}
        </button>
      </div>
    </header>
  );
}
