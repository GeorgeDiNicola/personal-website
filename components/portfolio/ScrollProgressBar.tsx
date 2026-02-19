"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

type ScrollProgressBarProps = {
  isDark: boolean;
};

export function ScrollProgressBar({ isDark }: ScrollProgressBarProps) {
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 26,
    mass: 0.3
  });

  if (prefersReducedMotion) {
    return null;
  }

  return (
    <motion.div
      aria-hidden="true"
      className={`fixed top-0 left-0 z-[60] h-1 w-full origin-left ${
        isDark
          ? "bg-gradient-to-r from-cyan-400 via-emerald-300 to-cyan-500"
          : "bg-gradient-to-r from-cyan-600 via-emerald-500 to-cyan-700"
      }`}
      style={{ scaleX }}
    />
  );
}
