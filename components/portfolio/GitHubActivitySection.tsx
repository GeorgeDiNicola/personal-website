"use client";

import { motion, useReducedMotion } from "framer-motion";

import { MotionSection } from "./motion/MotionSection";
import { createStagger, itemVariants, springTransition } from "./motion/tokens";
import { useResponsiveViewport } from "./motion/useResponsiveViewport";

const githubStagger = createStagger(0.12, 0.08);

type GitHubActivitySectionProps = {
  githubUsername: string;
  githubProfileUrl: string;
  githubCalendarUrl: string;
};

export function GitHubActivitySection({
  githubUsername,
  githubProfileUrl,
  githubCalendarUrl
}: GitHubActivitySectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const { viewportFor } = useResponsiveViewport();

  return (
    <MotionSection className="mt-12" delay={0.12}>
      <div className="portfolio-surface">
        <motion.div
          className="space-y-5"
          variants={githubStagger}
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView={prefersReducedMotion ? undefined : "show"}
          viewport={viewportFor(0.3, 0.14)}
        >
          <motion.div
            className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between"
            variants={itemVariants}
          >
            <div>
              <p className="portfolio-eyebrow site-text-static">
                GitHub
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
                Activity
              </h2>
            </div>
            <motion.a
              href={githubProfileUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={
                prefersReducedMotion
                  ? undefined
                  : { y: -2, x: 3, transition: springTransition }
              }
              className="portfolio-action px-3 py-1.5"
            >
              View Profile
            </motion.a>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="portfolio-inset overflow-hidden p-4"
          >
            <motion.img
              src={githubCalendarUrl}
              alt={`${githubUsername} GitHub contributions graph for the past year`}
              className="block h-auto w-full"
              initial={prefersReducedMotion ? false : { opacity: 0.85, scale: 0.985 }}
              whileInView={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
              viewport={viewportFor(0.4, 0.16)}
              transition={{ duration: 0.5 }}
            />
          </motion.div>
        </motion.div>
      </div>
    </MotionSection>
  );
}
