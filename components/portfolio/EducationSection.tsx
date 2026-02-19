"use client";

import { motion, useReducedMotion } from "framer-motion";

import { MotionSection } from "./motion/MotionSection";
import {
  createStagger,
  itemVariants,
  springTransition,
  timelineLineVariants
} from "./motion/tokens";
import type { School } from "./types";

const educationStagger = createStagger(0.14, 0.12);

type EducationSectionProps = {
  isDark: boolean;
  schools: School[];
};

export function EducationSection({ isDark, schools }: EducationSectionProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <MotionSection className="mt-12" delay={0.1}>
      <div
        className={`relative overflow-hidden rounded-3xl border p-6 md:p-8 ${
          isDark
            ? "border-slate-700 bg-slate-900/70"
            : "border-cyan-100 bg-gradient-to-br from-white via-cyan-50 to-amber-50"
        }`}
      >
        <motion.div
          aria-hidden="true"
          className={`pointer-events-none absolute -top-20 -right-16 h-56 w-56 rounded-full blur-3xl ${
            isDark ? "bg-cyan-500/10" : "bg-cyan-300/30"
          }`}
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.85 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.75 }}
        />
        <motion.div
          aria-hidden="true"
          className={`pointer-events-none absolute -bottom-24 -left-10 h-56 w-56 rounded-full blur-3xl ${
            isDark ? "bg-amber-400/10" : "bg-amber-200/40"
          }`}
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.9 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.8 }}
        />

        <div className="relative grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p
              className={`text-sm font-medium uppercase tracking-[0.18em] ${
                isDark ? "text-cyan-300" : "text-cyan-700"
              }`}
            >
              Education
            </p>
            <h2 className="mt-3 text-2xl font-semibold md:text-3xl">
              Academic Background
            </h2>
            <p
              className={`mt-3 text-sm leading-relaxed ${
                isDark ? "text-slate-300" : "text-slate-700"
              }`}
            >
              Foundation in computer science, mathematics, and economics with a
              practical focus on software systems.
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
              className="space-y-7"
              variants={educationStagger}
              initial={prefersReducedMotion ? false : "hidden"}
              whileInView={prefersReducedMotion ? undefined : "show"}
              viewport={{ once: true, amount: 0.25 }}
            >
              {schools.map((school) => (
                <motion.article
                  key={school.name}
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
                    <h3 className="text-lg font-semibold">{school.name}</h3>
                    <p
                      className={`text-sm font-medium ${
                        isDark ? "text-slate-400" : "text-slate-600"
                      }`}
                    >
                      {school.period}
                    </p>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-medium ${
                        isDark
                          ? "border-slate-600 bg-slate-800 text-slate-200"
                          : "border-slate-300 bg-white text-slate-700"
                      }`}
                    >
                      {school.degree1}
                    </span>
                    {school.degree2 && (
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-medium ${
                          isDark
                            ? "border-slate-600 bg-slate-800 text-slate-200"
                            : "border-slate-300 bg-white text-slate-700"
                        }`}
                      >
                        {school.degree2}
                      </span>
                    )}
                    {school.minor && (
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-medium ${
                          isDark
                            ? "border-cyan-800 bg-cyan-950/50 text-cyan-200"
                            : "border-cyan-200 bg-cyan-100/60 text-cyan-800"
                        }`}
                      >
                        Minor: {school.minor}
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
