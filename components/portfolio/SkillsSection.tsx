"use client";

import { motion } from "framer-motion";
import { useHydratedReducedMotion } from "./motion/useHydratedReducedMotion";
import Image from "next/image";

import { MotionSection } from "./motion/MotionSection";
import { createStagger, itemVariants } from "./motion/tokens";
import { useResponsiveViewport } from "./motion/useResponsiveViewport";
import type { Skill } from "./types";

const skillsStagger = createStagger(0.06, 0.04);

type SkillsSectionProps = {
  skills: Skill[];
};

export function SkillsSection({ skills }: SkillsSectionProps) {
  const prefersReducedMotion = useHydratedReducedMotion();
  const { viewportFor } = useResponsiveViewport();

  return (
    <MotionSection id="skills" className="portfolio-section" delay={0.05}>
      <div className="portfolio-surface">
        <div>
          <p className="portfolio-eyebrow site-text-static">
            Skills
          </p>
          <h2 className="mt-3">
            Technical Toolkit
          </h2>
          <p className="portfolio-copy mt-3 max-w-3xl text-sm">
            Core technologies I use for backend systems, infrastructure, data
            workflows, and frontend development.
          </p>

          <motion.div
            className="portfolio-skills-grid"
            variants={skillsStagger}
            initial={prefersReducedMotion ? false : "hidden"}
            whileInView={prefersReducedMotion ? undefined : "show"}
            viewport={viewportFor(0.25, 0.12)}
          >
            {skills.map((skill) => (
              <motion.article
                key={skill.name}
                variants={itemVariants}
                className="portfolio-skill"
              >
                <div
                  className="portfolio-skill-icon"
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
                <p>{skill.name}</p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </div>
    </MotionSection>
  );
}
