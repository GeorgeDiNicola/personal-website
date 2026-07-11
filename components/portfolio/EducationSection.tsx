"use client";

import { motion, useReducedMotion } from "framer-motion";

import { MotionSection } from "./motion/MotionSection";
import {
  createStagger,
  itemVariants,
  springTransition,
  timelineLineVariants
} from "./motion/tokens";
import { useResponsiveViewport } from "./motion/useResponsiveViewport";
import type { School } from "./types";

const educationStagger = createStagger(0.14, 0.12);

type EducationSectionProps = {
  isDark: boolean;
  schools: School[];
};

export function EducationSection({ isDark, schools }: EducationSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const { viewportFor } = useResponsiveViewport();

  return (
    <MotionSection className="mt-12" delay={0.1}>
      <div className="portfolio-surface">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="portfolio-eyebrow site-text-static">
              Education
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
              Academic Background
            </h2>
            <p className="portfolio-copy mt-3 text-sm">
              Foundation in computer science, mathematics, and economics with a
              practical focus on software systems.
            </p>
          </div>

          <div className="relative lg:col-span-8">
            <motion.div
              aria-hidden="true"
              className="absolute top-1 bottom-1 left-2 w-px origin-top bg-[var(--border)]"
              variants={timelineLineVariants}
              initial={prefersReducedMotion ? false : "hidden"}
              whileInView={prefersReducedMotion ? undefined : "show"}
              viewport={viewportFor(0.3, 0.14)}
            />
            <motion.div
              aria-hidden="true"
              className={`absolute top-1 bottom-1 left-2 w-px origin-top rounded-full ${
                prefersReducedMotion ? "" : "portfolio-timeline-flow"
              } bg-gradient-to-b from-transparent via-[var(--accent-two)] to-transparent`}
              variants={timelineLineVariants}
              initial={prefersReducedMotion ? false : "hidden"}
              whileInView={prefersReducedMotion ? undefined : "show"}
              viewport={viewportFor(0.3, 0.14)}
            />

            <motion.div
              className="space-y-7"
              variants={educationStagger}
              initial={prefersReducedMotion ? false : "hidden"}
              whileInView={prefersReducedMotion ? undefined : "show"}
              viewport={viewportFor(0.25, 0.12)}
            >
              {schools.map((school) => (
                <motion.article
                  key={school.name}
                  variants={itemVariants}
                  whileHover={
                    prefersReducedMotion
                      ? undefined
                      : {
                          x: 4,
                          transition: springTransition
                        }
                  }
                  className="relative pl-8"
                >
                  <motion.span
                    aria-hidden="true"
                    className="absolute top-1 left-0 inline-flex h-4 w-4 rounded-full border-2 border-[var(--accent)] bg-[var(--surface-strong)]"
                    initial={prefersReducedMotion ? false : { scale: 0.8, opacity: 0 }}
                    whileInView={prefersReducedMotion ? {} : { scale: 1, opacity: 1 }}
                    animate={
                      prefersReducedMotion
                        ? undefined
                        : {
                            boxShadow: isDark
                              ? [
                                  "0 0 0 0 rgba(251, 191, 36, 0)",
                                  "0 0 0 7px rgba(251, 191, 36, 0.12)",
                                  "0 0 0 0 rgba(251, 191, 36, 0)"
                                ]
                              : [
                                  "0 0 0 0 rgba(217, 119, 6, 0)",
                                  "0 0 0 7px rgba(217, 119, 6, 0.12)",
                                  "0 0 0 0 rgba(217, 119, 6, 0)"
                                ]
                          }
                    }
                    viewport={viewportFor(0.4, 0.16)}
                    transition={{
                      boxShadow: {
                        duration: 2.8,
                        repeat: Infinity,
                        ease: "easeInOut"
                      },
                      duration: 0.35
                    }}
                  />
                  <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
                    <h3 className="text-lg font-semibold tracking-tight">
                      {school.name}
                    </h3>
                    <p className="portfolio-muted font-mono text-sm font-medium">
                      {school.period}
                    </p>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="portfolio-chip site-text-static">
                      {school.degree1}
                    </span>
                    {school.degree2 && (
                      <span className="portfolio-chip site-text-static">
                        {school.degree2}
                      </span>
                    )}
                    {school.minor && (
                      <span className="portfolio-chip-muted site-text-static">
                        Minor: {school.minor}
                      </span>
                    )}
                    {school.concentration && (
                      <span className="portfolio-chip-muted site-text-static">
                        Concentration: {school.concentration}
                      </span>
                    )}
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </MotionSection>
  );
}
