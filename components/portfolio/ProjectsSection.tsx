"use client";

import { motion, useReducedMotion } from "framer-motion";

import { MotionSection } from "./motion/MotionSection";
import { createStagger, itemVariants, springTransition } from "./motion/tokens";
import { useResponsiveViewport } from "./motion/useResponsiveViewport";
import type { Project } from "./types";

const projectsStagger = createStagger(0.1, 0.08);

type ProjectsSectionProps = {
  projects: Project[];
};

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const { viewportFor } = useResponsiveViewport();

  return (
    <MotionSection className="mt-12" delay={0.14}>
      <div className="portfolio-surface">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="portfolio-eyebrow site-text-static">
              Projects
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
              Featured Work
            </h2>
            <p className="portfolio-copy mt-3 text-sm">
              Selected projects spanning analytics, automation, and software
              systems.
            </p>
          </div>

          <motion.div
            className="lg:col-span-8"
            variants={projectsStagger}
            initial={prefersReducedMotion ? false : "hidden"}
            whileInView={prefersReducedMotion ? undefined : "show"}
            viewport={viewportFor(0.25, 0.12)}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {projects.map((project) => (
                <motion.article
                  key={project.title}
                  variants={itemVariants}
                  whileHover={
                    prefersReducedMotion
                      ? undefined
                      : {
                          y: -5,
                          scale: 1.01,
                          transition: springTransition
                        }
                  }
                  className="portfolio-card p-5"
                >
                  <h3 className="text-base font-semibold tracking-tight md:text-lg">
                    {project.title}
                  </h3>
                  <p className="portfolio-copy mt-2 text-sm">
                    {project.description}
                  </p>
                  {project.link && (
                    <motion.a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={
                        prefersReducedMotion
                          ? undefined
                          : { x: 4, transition: springTransition }
                      }
                      className="portfolio-action mt-4 px-3 py-1.5"
                    >
                      See Project
                    </motion.a>
                  )}
                </motion.article>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </MotionSection>
  );
}
