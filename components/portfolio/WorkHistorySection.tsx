"use client";

import { motion } from "framer-motion";
import { useHydratedReducedMotion } from "./motion/useHydratedReducedMotion";

import { MotionSection } from "./motion/MotionSection";
import { createStagger, itemVariants } from "./motion/tokens";
import { useResponsiveViewport } from "./motion/useResponsiveViewport";
import type { WorkExperience } from "./types";

const experienceStagger = createStagger(0.14, 0.15);

type WorkHistorySectionProps = {
  workHistory: WorkExperience[];
};

export function WorkHistorySection({
  workHistory
}: WorkHistorySectionProps) {
  const prefersReducedMotion = useHydratedReducedMotion();
  const { viewportFor } = useResponsiveViewport();

  return (
    <MotionSection id="experience" className="portfolio-section" delay={0.08}>
      <div className="portfolio-surface">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="portfolio-section-header lg:col-span-4">
            <p className="portfolio-eyebrow site-text-static">
              Experience
            </p>
            <h2 className="mt-3">
              Work History
            </h2>
            <p className="portfolio-copy mt-3 text-sm">
              Roles across platform infrastructure, full-stack product
              development, and data engineering.
            </p>
          </div>

          <div className="portfolio-section-body lg:col-span-8">
            <motion.div
              className="portfolio-timeline"
              variants={experienceStagger}
              initial={prefersReducedMotion ? false : "hidden"}
              whileInView={prefersReducedMotion ? undefined : "show"}
              viewport={viewportFor(0.25, 0.12)}
            >
              {workHistory.map((job) => (
                <motion.article
                  key={`${job.company}-${job.role}`}
                  variants={itemVariants}
                  className="portfolio-timeline-entry"
                >
                  <span className="portfolio-timeline-node" aria-hidden="true" />
                  <div className="flex flex-col gap-1 xl:flex-row xl:items-baseline xl:justify-between">
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
