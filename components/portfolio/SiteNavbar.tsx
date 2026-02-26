"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type SiteNavbarProps = {
  isDark: boolean;
};

export function SiteNavbar({ isDark }: SiteNavbarProps) {
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
    <header className="relative z-40 px-6 pt-4 md:px-10">
      <div
        className={`mx-auto flex w-full max-w-6xl items-center justify-center rounded-2xl border p-1.5 backdrop-blur-xl ${
          isDark
            ? "border-slate-700/80 bg-slate-900/70"
            : "border-slate-200 bg-white/80"
        }`}
      >
        <nav aria-label="Main" className="flex w-full max-w-md gap-1">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex-1 rounded-xl px-4 py-2 text-center text-sm font-semibold tracking-wide transition-colors md:text-base ${
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
      </div>
    </header>
  );
}
