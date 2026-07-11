"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

import { MotionSection } from "./motion/MotionSection";
import { createStagger, itemVariants, springTransition } from "./motion/tokens";
import { useResponsiveViewport } from "./motion/useResponsiveViewport";
import type { Skill } from "./types";

const skillsStagger = createStagger(0.06, 0.04);

type SkillsSectionProps = {
  skills: Skill[];
};

export function SkillsSection({ skills }: SkillsSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const { viewportFor } = useResponsiveViewport();

  return (
    <MotionSection className="mt-10" delay={0.05}>
      <div className="portfolio-surface">
        <div>
          <p className="portfolio-eyebrow site-text-static">
            Skills
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
            Technical Toolkit
          </h2>
          <p className="portfolio-copy mt-3 max-w-3xl text-sm">
            Core technologies I use for backend systems, infrastructure, data
            workflows, and frontend development.
          </p>

          <motion.div
            className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7"
            variants={skillsStagger}
            initial={prefersReducedMotion ? false : "hidden"}
            whileInView={prefersReducedMotion ? undefined : "show"}
            viewport={viewportFor(0.25, 0.12)}
          >
            {skills.map((skill) => (
              <motion.article
                key={skill.name}
                variants={itemVariants}
                whileHover={
                  prefersReducedMotion
                    ? undefined
                    : { y: -4, scale: 1.015, transition: springTransition }
                }
                className="portfolio-card p-3 text-center"
              >
                <div
                  className="portfolio-inset mx-auto flex h-12 w-12 items-center justify-center"
                >
                  <Image
                    src={skill.logo}
                    alt={`${skill.name} logo`}
                    width={28}
                    height={28}
                    unoptimized
                    className="h-7 w-7 object-contain"
                  />
                </div>
                <p className="mt-2 text-xs font-semibold text-[var(--text-soft)] md:text-sm">
                  {skill.name}
                </p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </div>
    </MotionSection>
  );
}
