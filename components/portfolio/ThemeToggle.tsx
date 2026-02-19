"use client";

import { motion, useReducedMotion } from "framer-motion";

import { springTransition } from "./motion/tokens";
import type { Theme } from "./types";

type ThemeToggleProps = {
  isDark: boolean;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
};

export function ThemeToggle({
  isDark,
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
      <div
        className={`inline-flex items-center gap-1 rounded-full border p-1 backdrop-blur ${
          isDark
            ? "border-slate-700 bg-slate-900/80"
            : "border-slate-300 bg-white/85"
        }`}
      >
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
          className={`h-9 w-9 rounded-full text-lg transition ${
            theme === "light"
              ? "bg-amber-300 text-slate-900"
              : isDark
                ? "text-slate-300 hover:bg-slate-800"
                : "text-slate-700 hover:bg-slate-100"
          }`}
        >
          ☀
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
          className={`h-9 w-9 rounded-full text-lg transition ${
            theme === "dark"
              ? "bg-slate-700 text-white"
              : isDark
                ? "text-slate-300 hover:bg-slate-800"
                : "text-slate-700 hover:bg-slate-100"
          }`}
        >
          ☾
        </motion.button>
      </div>
    </motion.div>
  );
}
