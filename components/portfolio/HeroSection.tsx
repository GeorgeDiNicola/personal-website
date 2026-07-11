"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

import { MotionSection } from "./motion/MotionSection";
import {
  createStagger,
  itemVariants,
  motionEasing,
  springTransition
} from "./motion/tokens";
import { useResponsiveViewport } from "./motion/useResponsiveViewport";

const heroStagger = createStagger(0.12, 0.08);

export function HeroSection() {
  const prefersReducedMotion = useReducedMotion();
  const { viewportFor } = useResponsiveViewport();

  return (
    <MotionSection className="relative" amount={0.55}>
      <div className="portfolio-hero-surface mx-auto max-w-4xl text-center">
        <motion.div
          className="flex flex-col items-center gap-5"
          variants={heroStagger}
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView={prefersReducedMotion ? undefined : "show"}
          viewport={viewportFor(0.55, 0.2)}
        >
          <motion.div variants={itemVariants} className="relative">
            <motion.div
              className="absolute -inset-2 rounded-full bg-[conic-gradient(from_210deg,var(--accent),transparent_35%,var(--accent-two),transparent_70%,var(--accent))] opacity-70 blur-sm"
              initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.8 }}
              whileInView={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
              viewport={viewportFor(0.55, 0.2)}
              transition={{ duration: 0.7, ease: motionEasing.outExpo, delay: 0.08 }}
            />
            <motion.div
              whileHover={
                prefersReducedMotion
                  ? undefined
                  : { y: -2, scale: 1.015, rotate: -0.4 }
              }
              transition={springTransition}
            >
              <Image
                src="/me.jpg"
                alt="Portrait of George DiNicola"
                width={168}
                height={168}
                priority
                className="relative h-32 w-32 rounded-full border-2 border-[var(--surface-strong)] object-cover shadow-[0_18px_42px_rgba(0,0,0,0.22)] md:h-40 md:w-40"
              />
            </motion.div>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="portfolio-eyebrow site-text-static"
          >
            Professional Portfolio
          </motion.p>
          <motion.h1
            variants={itemVariants}
            className="text-4xl font-semibold leading-tight tracking-tight md:text-6xl"
          >
            George DiNicola
          </motion.h1>
          <motion.div variants={itemVariants} className="max-w-3xl space-y-4">
            <p className="portfolio-copy text-base md:text-lg">
              Software Engineer with 3+ years of experience. I specialize in
              production backend systems and data infrastructure, with interest
              in distributed systems, data engineering, and machine learning.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </MotionSection>
  );
}
