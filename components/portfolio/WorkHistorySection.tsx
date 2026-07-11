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
import type { WorkExperience } from "./types";

const experienceStagger = createStagger(0.14, 0.15);

type WorkHistorySectionProps = {
  isDark: boolean;
  workHistory: WorkExperience[];
};

export function WorkHistorySection({
  isDark,
  workHistory
}: WorkHistorySectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const { viewportFor } = useResponsiveViewport();

  return (
    <MotionSection className="mt-10" delay={0.08}>
      <div className="portfolio-surface">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="portfolio-eyebrow site-text-static">
              Experience
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
              Work History
            </h2>
            <p className="portfolio-copy mt-3 text-sm">
              Roles across platform infrastructure, full-stack product
              development, and data engineering.
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
              className="space-y-8"
              variants={experienceStagger}
              initial={prefersReducedMotion ? false : "hidden"}
              whileInView={prefersReducedMotion ? undefined : "show"}
              viewport={viewportFor(0.25, 0.12)}
            >
              {workHistory.map((job) => (
                <motion.article
                  key={`${job.company}-${job.role}`}
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
                      {job.role} · {job.company}
                    </h3>
                    <p className="portfolio-muted font-mono text-sm font-medium">
                      {job.period}
                    </p>
                  </div>
                  {job.department && (
                    <p className="mt-1 text-sm font-semibold text-[var(--text-soft)]">
                      {job.department}
                    </p>
                  )}
                  <p className="portfolio-copy mt-2 max-w-3xl text-sm">
                    {job.summary}
                  </p>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </MotionSection>
  );
}
