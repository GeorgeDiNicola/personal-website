"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 26,
    mass: 0.3
  });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 left-0 z-[60] h-0.5 w-full origin-left bg-[var(--accent)] motion-reduce:hidden"
      style={{ scaleX }}
    />
  );
}
