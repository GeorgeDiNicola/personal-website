"use client";

import { motion, useReducedMotion } from "framer-motion";

import { MotionSection } from "./motion/MotionSection";
import { createStagger, itemVariants, springTransition } from "./motion/tokens";
import type { Project } from "./types";

const projectsStagger = createStagger(0.1, 0.08);

type ProjectsSectionProps = {
  isDark: boolean;
  projects: Project[];
};

export function ProjectsSection({ isDark, projects }: ProjectsSectionProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <MotionSection className="mt-12" delay={0.14}>
      <div
        className={`relative overflow-hidden rounded-3xl border p-6 md:p-8 ${
          isDark
            ? "border-slate-700 bg-slate-900/70"
            : "border-cyan-100 bg-gradient-to-br from-white via-cyan-50 to-amber-50"
        }`}
      >
        <motion.div
          aria-hidden="true"
          className={`pointer-events-none absolute -top-24 -right-10 h-56 w-56 rounded-full blur-3xl ${
            isDark ? "bg-cyan-500/10" : "bg-cyan-300/30"
          }`}
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.85 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.75 }}
        />
        <motion.div
          aria-hidden="true"
          className={`pointer-events-none absolute -bottom-24 -left-8 h-56 w-56 rounded-full blur-3xl ${
            isDark ? "bg-amber-500/10" : "bg-amber-200/40"
          }`}
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.9 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.85 }}
        />

        <div className="relative grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p
              className={`text-sm font-medium uppercase tracking-[0.18em] ${
                isDark ? "text-cyan-300" : "text-cyan-700"
              }`}
            >
              Projects
            </p>
            <h2 className="mt-3 text-2xl font-semibold md:text-3xl">
              Featured Work
            </h2>
            <p
              className={`mt-3 text-sm leading-relaxed ${
                isDark ? "text-slate-300" : "text-slate-700"
              }`}
            >
              Selected projects spanning analytics, automation, and software
              systems.
            </p>
          </div>

          <motion.div
            className="lg:col-span-8"
            variants={projectsStagger}
            initial={prefersReducedMotion ? false : "hidden"}
            whileInView={prefersReducedMotion ? undefined : "show"}
            viewport={{ once: true, amount: 0.25 }}
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
                  className={`rounded-2xl border p-5 ${
                    isDark
                      ? "border-slate-700 bg-slate-900/80"
                      : "border-slate-200 bg-white/90"
                  }`}
                >
                  <h3 className="text-base font-semibold md:text-lg">
                    {project.title}
                  </h3>
                  <p
                    className={`mt-2 text-sm leading-relaxed ${
                      isDark ? "text-slate-300" : "text-slate-700"
                    }`}
                  >
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
                      className={`mt-4 inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] transition ${
                        isDark
                          ? "border-cyan-700/70 text-cyan-200 hover:bg-cyan-900/30"
                          : "border-cyan-300 text-cyan-800 hover:bg-cyan-100/70"
                      }`}
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
