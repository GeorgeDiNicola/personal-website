"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

import { motionEasing, sectionVariants } from "./tokens";
import { useResponsiveViewport } from "./useResponsiveViewport";

type MotionSectionProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
  amount?: number;
};

export function MotionSection({
  children,
  className,
  delay = 0,
  once = true,
  amount = 0.2
}: MotionSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const { viewportFor } = useResponsiveViewport();

  if (prefersReducedMotion) {
    return <section className={className}>{children}</section>;
  }

  return (
    <motion.section
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={viewportFor(amount, Math.min(amount, 0.14), once)}
      variants={sectionVariants}
      transition={{ delay, ease: motionEasing.outExpo }}
    >
      {children}
    </motion.section>
  );
}
