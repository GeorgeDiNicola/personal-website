"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll, useReducedMotion } from "framer-motion";
import { useState } from "react";

import { springTransition } from "./motion/tokens";

export function BackToTopButton() {
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
          className="portfolio-icon-button fixed right-4 bottom-4 z-50 inline-flex h-11 w-11 items-center justify-center rounded-full text-xl font-bold backdrop-blur-xl md:right-6 md:bottom-6"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 14l6-6 6 6" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
