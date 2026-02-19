"use client";

import { motion, useReducedMotion } from "framer-motion";

import { MotionSection } from "./motion/MotionSection";
import {
  createStagger,
  itemVariants,
  springTransition,
  timelineLineVariants
} from "./motion/tokens";
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

  return (
    <MotionSection className="mt-10" delay={0.08}>
      <div
        className={`relative overflow-hidden rounded-3xl border p-6 md:p-8 ${
          isDark
            ? "border-slate-700 bg-slate-900/70"
            : "border-cyan-100 bg-gradient-to-br from-white via-cyan-50 to-amber-50"
        }`}
      >
        <motion.div
          aria-hidden="true"
          className={`pointer-events-none absolute -top-24 -left-10 h-56 w-56 rounded-full blur-3xl ${
            isDark ? "bg-amber-500/10" : "bg-amber-200/40"
          }`}
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.85 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.75 }}
        />
        <motion.div
          aria-hidden="true"
          className={`pointer-events-none absolute -bottom-24 -right-8 h-56 w-56 rounded-full blur-3xl ${
            isDark ? "bg-cyan-500/10" : "bg-cyan-300/30"
          }`}
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.9 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.85 }}
        />

        <div className="relative grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p
              className={`text-sm font-medium uppercase tracking-[0.18em] ${
                isDark ? "text-cyan-300" : "text-cyan-700"
              }`}
            >
              Experience
            </p>
            <h2 className="mt-3 text-2xl font-semibold md:text-3xl">
              Work History
            </h2>
            <p
              className={`mt-3 text-sm leading-relaxed ${
                isDark ? "text-slate-300" : "text-slate-700"
              }`}
            >
              Roles across platform infrastructure, full-stack product
              development, and data engineering.
            </p>
          </div>

          <div className="relative lg:col-span-8">
            <motion.div
              aria-hidden="true"
              className={`absolute top-1 bottom-1 left-2 w-px origin-top ${
                isDark ? "bg-slate-700" : "bg-slate-300"
              }`}
              variants={timelineLineVariants}
              initial={prefersReducedMotion ? false : "hidden"}
              whileInView={prefersReducedMotion ? undefined : "show"}
              viewport={{ once: true, amount: 0.3 }}
            />

            <motion.div
              className="space-y-8"
              variants={experienceStagger}
              initial={prefersReducedMotion ? false : "hidden"}
              whileInView={prefersReducedMotion ? undefined : "show"}
              viewport={{ once: true, amount: 0.25 }}
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
                    className={`absolute top-1 left-0 inline-flex h-4 w-4 rounded-full border-2 ${
                      isDark
                        ? "border-cyan-300 bg-slate-900"
                        : "border-cyan-600 bg-white"
                    }`}
                    initial={prefersReducedMotion ? false : { scale: 0.8, opacity: 0 }}
                    whileInView={prefersReducedMotion ? {} : { scale: 1, opacity: 1 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.35 }}
                  />
                  <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
                    <h3 className="text-lg font-semibold">
                      {job.role} · {job.company}
                    </h3>
                    <p
                      className={`text-sm font-medium ${
                        isDark ? "text-slate-400" : "text-slate-600"
                      }`}
                    >
                      {job.period}
                    </p>
                  </div>
                  {job.department && (
                    <p
                      className={`mt-1 text-sm font-semibold ${
                        isDark ? "text-slate-200" : "text-slate-800"
                      }`}
                    >
                      {job.department}
                    </p>
                  )}
                  <p
                    className={`mt-2 max-w-3xl text-sm leading-relaxed ${
                      isDark ? "text-slate-300" : "text-slate-700"
                    }`}
                  >
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
