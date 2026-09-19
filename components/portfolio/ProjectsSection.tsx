"use client";

import { motion } from "framer-motion";
import { useHydratedReducedMotion } from "./motion/useHydratedReducedMotion";
import Link from "next/link";

import { MotionSection } from "./motion/MotionSection";
import { createStagger, itemVariants } from "./motion/tokens";
import { useResponsiveViewport } from "./motion/useResponsiveViewport";
import type { Project } from "./types";

const projectsStagger = createStagger(0.1, 0.08);

type ProjectsSectionProps = {
  projects: Project[];
};

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const prefersReducedMotion = useHydratedReducedMotion();
  const { viewportFor } = useResponsiveViewport();

  return (
    <MotionSection id="projects" className="portfolio-section" delay={0.14}>
      <div className="portfolio-surface">
        <div className="grid gap-6">
          <div>
            <p className="portfolio-eyebrow site-text-static">
              Projects
            </p>
            <h2 className="mt-3">
              Featured Personal Projects
            </h2>
          </div>

          <motion.div
            variants={projectsStagger}
            initial={prefersReducedMotion ? false : "hidden"}
            whileInView={prefersReducedMotion ? undefined : "show"}
            viewport={viewportFor(0.25, 0.12)}
          >
            <div className="portfolio-project-grid">
              {projects.map((project) => (
                <motion.article
                  key={project.title}
                  variants={itemVariants}
                  className={`portfolio-card project-showcase-card ${
                    project.featured ? "project-showcase-card-featured" : ""
                  }`}
                >
                  <div className="project-card-heading">
                    <h3>{project.title}</h3>
                    {project.tags && project.tags.length > 0 ? (
                      <div className="mt-5 flex flex-wrap gap-y-2">
                        {project.tags.map((tag) => (
                          <span key={tag} className="project-tag site-text-static">
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                  <p className="portfolio-copy flex-1">
                    {project.description}
                  </p>
                  <ProjectDetailsLink project={project} />
                </motion.article>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </MotionSection>
  );
}

function ProjectDetailsLink({ project }: { project: Project }) {
  const href = project.link?.trim();
  const isExternal = !!href && /^https?:\/\//.test(href);
  const icon = (
    <span className="project-card-link-icon site-text-static" aria-hidden="true">
      <svg
        viewBox="0 0 16 16"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      >
        {isExternal ? (
          <path d="M4 12 12 4M4 4h8v8" />
        ) : (
          <path d="M3 8h10M8 3l5 5-5 5" />
        )}
      </svg>
    </span>
  );

  if (!href) {
    return (
      <button
        type="button"
        disabled
        className="project-card-link"
        aria-label={`Details for ${project.title} are coming soon`}
      >
        <span className="site-text-static">Details coming soon</span>
        {icon}
      </button>
    );
  }

  return (
    <Link
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="project-card-link"
      aria-label={`View details for ${project.title}${isExternal ? " (opens in a new tab)" : ""}`}
    >
      <span className="site-text-static">View details</span>
      {icon}
    </Link>
  );
}
