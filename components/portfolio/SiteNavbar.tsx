"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type SiteNavbarProps = {
  isDark: boolean;
  theme: string;
  onThemeChange: (theme: "light" | "dark") => void;
};

export function SiteNavbar({ isDark, theme, onThemeChange }: SiteNavbarProps) {
  const pathname = usePathname();
  const isPersonalRoute = /\/personal(?:\/|$)/.test(pathname);

  const tabs = [
    { href: "/", label: "Professional", active: !isPersonalRoute },
    {
      href: "/personal",
      label: "Personal",
      active: isPersonalRoute
    }
  ];

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
