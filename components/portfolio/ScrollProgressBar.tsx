"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

export function ScrollProgressBar() {
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
      className="fixed top-0 left-0 z-[60] h-1 w-full origin-left bg-[linear-gradient(90deg,var(--accent),var(--accent-two),var(--accent))] shadow-[0_0_18px_var(--accent-ring)]"
      style={{ scaleX }}
    />
  );
}
