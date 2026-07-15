"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { CSSProperties } from "react";

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
    <MotionSection id="projects" className="mt-12 scroll-mt-32" delay={0.14}>
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
              {projects.map((project) => {
                const projectCardStyle = {
                  "--project-accent": project.accent ?? "var(--accent)"
                } as CSSProperties;

                return (
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
                  className={`portfolio-card portfolio-card-accent project-showcase-card flex min-h-full flex-col p-5 ${
                    project.featured ? "project-showcase-card-featured sm:col-span-2" : ""
                  }`}
                  style={projectCardStyle}
                >
                  <h3 className="text-base font-semibold tracking-tight md:text-lg">
                    {project.title}
                  </h3>
                  {project.tags && project.tags.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="project-tag site-text-static"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  <p className="portfolio-copy mt-3 flex-1 text-sm">
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
                      className="portfolio-action project-card-link mt-4 px-3 py-1.5"
                    >
                      <span>See Project</span>
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 16 16"
                        className="h-3.5 w-3.5"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                      >
                        <path d="M5.2 4.5h6.3v6.3" />
                        <path d="m4.5 11.5 7-7" />
                      </svg>
                    </motion.a>
                  )}
                </motion.article>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </MotionSection>
  );
}
