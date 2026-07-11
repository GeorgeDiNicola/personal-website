"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

type ParallaxBackgroundProps = {
  isDark: boolean;
};

export function ParallaxBackground({ isDark }: ParallaxBackgroundProps) {
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();

  const sweepY = useTransform(scrollYProgress, [0, 1], [0, -110]);
  const textureY = useTransform(scrollYProgress, [0, 1], [0, 70]);

  return (
    <div
      className={`portfolio-backdrop ${isDark ? "opacity-100" : "opacity-95"}`}
      aria-hidden="true"
    >
      <motion.div
        className="portfolio-light-sweep"
        style={{ y: prefersReducedMotion ? 0 : sweepY }}
      />
      <motion.div
        className="absolute inset-x-0 top-24 h-[70vh] bg-[linear-gradient(180deg,transparent,rgba(255,255,255,0.06),transparent)] opacity-60"
        style={{ y: prefersReducedMotion ? 0 : textureY }}
      />
    </div>
  );
}
