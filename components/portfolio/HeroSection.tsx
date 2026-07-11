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
const heroSignalRows = [
  ["Focus", "Backend Systems + Data Engineering"],
  ["Recent", "Core Platform + Identity Systems"],
  ["Previous", "Data Science + Machine Learning"]
] as const;

export function HeroSection() {
  const prefersReducedMotion = useReducedMotion();
  const { viewportFor } = useResponsiveViewport();

  return (
    <MotionSection className="relative" amount={0.55}>
      <div className="portfolio-hero-surface mx-auto max-w-4xl">
        <motion.div
          className="mx-auto grid max-w-4xl items-center gap-7 md:grid-cols-[minmax(0,1.1fr)_minmax(14rem,0.9fr)]"
          variants={heroStagger}
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView={prefersReducedMotion ? undefined : "show"}
          viewport={viewportFor(0.55, 0.2)}
        >
          <div className="order-2 grid gap-5 text-center md:order-1 md:text-left">
            <motion.div variants={itemVariants}>
              <p className="portfolio-eyebrow site-text-static">
                Professional Portfolio
              </p>
              <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
                George DiNicola
              </h1>
            </motion.div>

            <motion.div variants={itemVariants}>
              <div className="flex flex-wrap justify-center gap-2 md:justify-start">
                <span className="portfolio-chip site-text-static">
                  Software Engineer
                </span>
                <span className="portfolio-chip site-text-static">
                  Data Engineer
                </span>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="portfolio-hero-console p-4 md:p-5"
            >
              {heroSignalRows.map(([key, value]) => (
                <div key={key} className="portfolio-console-row">
                  <span className="portfolio-console-key site-text-static">
                    {key}
                  </span>
                  <span className="text-left sm:text-right">{value}</span>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            variants={itemVariants}
            className="relative order-1 mx-auto grid aspect-square w-full max-w-[15rem] place-items-center md:order-2 md:max-w-[18rem]"
          >
            <div className="portfolio-hero-orbit" aria-hidden="true" />
            <motion.div
              className="relative"
              whileHover={
                prefersReducedMotion
                  ? undefined
                  : { y: -2, scale: 1.015, rotate: -0.4 }
              }
              transition={springTransition}
            >
              <motion.div
                className="absolute -inset-2 rounded-full bg-[conic-gradient(from_210deg,var(--accent),transparent_35%,var(--accent-two),transparent_70%,var(--accent))] opacity-70 blur-sm"
                initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.8 }}
                whileInView={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
                viewport={viewportFor(0.55, 0.2)}
                transition={{ duration: 0.7, ease: motionEasing.outExpo, delay: 0.08 }}
              />
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
        </motion.div>
      </div>
    </MotionSection>
  );
}
