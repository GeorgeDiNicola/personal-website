"use client";

import { motion, useReducedMotion } from "framer-motion";

import { springTransition } from "./motion/tokens";
import type { Theme } from "./types";

type ThemeToggleProps = {
  theme: string;
  onThemeChange: (theme: Theme) => void;
};

export function ThemeToggle({
  theme,
  onThemeChange
}: ThemeToggleProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className="fixed top-4 right-4 z-50"
      initial={prefersReducedMotion ? false : { y: -14, opacity: 0 }}
      animate={prefersReducedMotion ? undefined : { y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface)] p-1 shadow-[var(--shadow-card)] backdrop-blur-xl">
        <motion.button
          type="button"
          aria-label="Switch to light mode"
          title="Light mode"
          onClick={() => onThemeChange("light")}
          whileHover={
            prefersReducedMotion ? undefined : { y: -1, transition: springTransition }
          }
          whileTap={
            prefersReducedMotion ? undefined : { scale: 0.94, transition: springTransition }
          }
          className={`inline-flex h-9 w-9 items-center justify-center rounded-full transition ${
            theme === "light"
              ? "bg-[var(--accent-two-soft)] text-[var(--accent-two)] shadow-[inset_0_1px_0_var(--highlight)]"
              : "text-[var(--text-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]"
          }`}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-[18px] w-[18px]"
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
        </motion.button>
        <motion.button
          type="button"
          aria-label="Switch to dark mode"
          title="Dark mode"
          onClick={() => onThemeChange("dark")}
          whileHover={
            prefersReducedMotion ? undefined : { y: -1, transition: springTransition }
          }
          whileTap={
            prefersReducedMotion ? undefined : { scale: 0.94, transition: springTransition }
          }
          className={`inline-flex h-9 w-9 items-center justify-center rounded-full transition ${
            theme === "dark"
              ? "bg-[var(--accent-soft)] text-[var(--accent-strong)] shadow-[inset_0_1px_0_var(--highlight)]"
              : "text-[var(--text-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]"
          }`}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-[18px] w-[18px]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 3a6 6 0 0 0 9 7.5A8.5 8.5 0 1 1 12 3Z" />
          </svg>
        </motion.button>
      </div>
    </motion.div>
  );
}
