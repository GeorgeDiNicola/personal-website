"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

type ParallaxBackgroundProps = {
  isDark: boolean;
};

export function ParallaxBackground({ isDark }: ParallaxBackgroundProps) {
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();

  const orbOneY = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const orbTwoY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const orbThreeY = useTransform(scrollYProgress, [0, 1], [0, -90]);

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <motion.div
        className={`absolute -top-24 -left-20 h-72 w-72 rounded-full blur-3xl ${
          isDark ? "bg-cyan-500/10" : "bg-cyan-300/30"
        }`}
        style={{ y: prefersReducedMotion ? 0 : orbOneY }}
      />
      <motion.div
        className={`absolute top-1/3 -right-28 h-96 w-96 rounded-full blur-3xl ${
          isDark ? "bg-emerald-400/8" : "bg-amber-200/35"
        }`}
        style={{ y: prefersReducedMotion ? 0 : orbTwoY }}
      />
      <motion.div
        className={`absolute bottom-[-6rem] left-1/3 h-80 w-80 rounded-full blur-3xl ${
          isDark ? "bg-amber-400/8" : "bg-cyan-200/30"
        }`}
        style={{ y: prefersReducedMotion ? 0 : orbThreeY }}
      />
    </div>
  );
}
