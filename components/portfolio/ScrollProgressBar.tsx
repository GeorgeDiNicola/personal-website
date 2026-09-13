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
      className="fixed top-0 left-0 z-[60] h-1 w-full origin-left bg-[linear-gradient(90deg,var(--accent),var(--accent-two),var(--accent))] shadow-[0_0_18px_var(--accent-ring)] motion-reduce:hidden"
      style={{ scaleX }}
    />
  );
}
