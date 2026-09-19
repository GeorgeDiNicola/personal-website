"use client";

import { motion } from "framer-motion";
import { useHydratedReducedMotion } from "./motion/useHydratedReducedMotion";

import { MotionSection } from "./motion/MotionSection";
import { createStagger, itemVariants } from "./motion/tokens";
import { useResponsiveViewport } from "./motion/useResponsiveViewport";
import type { School } from "./types";

const educationStagger = createStagger(0.14, 0.12);

type EducationSectionProps = {
  schools: School[];
};

export function EducationSection({ schools }: EducationSectionProps) {
  const prefersReducedMotion = useHydratedReducedMotion();
  const { viewportFor } = useResponsiveViewport();

  return (
    <MotionSection id="education" className="portfolio-section" delay={0.1}>
      <div className="portfolio-surface">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="portfolio-section-header lg:col-span-4">
            <p className="portfolio-eyebrow site-text-static">
              Education
            </p>
            <h2 className="mt-3">
              Academic Background
            </h2>
            <p className="portfolio-copy mt-3 text-sm">
              Foundation in computer science, mathematics, and economics with a
              practical focus on software systems.
            </p>
          </div>

          <div className="portfolio-section-body lg:col-span-8">
            <motion.div
              className="portfolio-timeline"
              variants={educationStagger}
              initial={prefersReducedMotion ? false : "hidden"}
              whileInView={prefersReducedMotion ? undefined : "show"}
              viewport={viewportFor(0.25, 0.12)}
            >
              {schools.map((school) => (
                <motion.article
                  key={school.name}
                  variants={itemVariants}
                  className="portfolio-timeline-entry"
                >
                  <span className="portfolio-timeline-node" aria-hidden="true" />
                  <div className="flex flex-col gap-1 xl:flex-row xl:items-baseline xl:justify-between">
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
