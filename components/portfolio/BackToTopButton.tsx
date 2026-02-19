"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll, useReducedMotion } from "framer-motion";
import { useState } from "react";

import { springTransition } from "./motion/tokens";

type BackToTopButtonProps = {
  isDark: boolean;
};

export function BackToTopButton({ isDark }: BackToTopButtonProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollY } = useScroll();
  const prefersReducedMotion = useReducedMotion();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsVisible(latest > 360);
  });

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          type="button"
          aria-label="Back to top"
          title="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12, scale: 0.9 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
          exit={prefersReducedMotion ? undefined : { opacity: 0, y: 12, scale: 0.9 }}
          whileHover={
            prefersReducedMotion
              ? undefined
              : { y: -3, scale: 1.05, transition: springTransition }
          }
          whileTap={
            prefersReducedMotion
              ? undefined
              : { scale: 0.94, transition: springTransition }
          }
          className={`fixed right-4 bottom-4 z-50 inline-flex h-11 w-11 items-center justify-center rounded-full border text-xl font-bold shadow-lg transition md:right-6 md:bottom-6 ${
            isDark
              ? "border-slate-600 bg-slate-900/90 text-slate-100 hover:bg-slate-800"
              : "border-slate-300 bg-white/90 text-slate-900 hover:bg-slate-100"
          }`}
        >
          ^
        </motion.button>
      )}
    </AnimatePresence>
  );
}
