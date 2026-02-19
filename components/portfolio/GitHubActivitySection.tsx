"use client";

import { motion, useReducedMotion } from "framer-motion";

import { MotionSection } from "./motion/MotionSection";
import { createStagger, itemVariants, springTransition } from "./motion/tokens";

const githubStagger = createStagger(0.12, 0.08);

type GitHubActivitySectionProps = {
  isDark: boolean;
  githubUsername: string;
  githubProfileUrl: string;
  githubCalendarUrl: string;
};

export function GitHubActivitySection({
  isDark,
  githubUsername,
  githubProfileUrl,
  githubCalendarUrl
}: GitHubActivitySectionProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <MotionSection className="mt-12" delay={0.12}>
      <div
        className={`relative overflow-hidden rounded-3xl border p-6 md:p-8 ${
          isDark
            ? "border-slate-700 bg-slate-900/70"
            : "border-cyan-100 bg-gradient-to-br from-white via-cyan-50 to-amber-50"
        }`}
      >
        <motion.div
          aria-hidden="true"
          className={`pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full blur-3xl ${
            isDark ? "bg-cyan-500/10" : "bg-cyan-300/30"
          }`}
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.85 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.75 }}
        />

        <motion.div
          className="relative space-y-5"
          variants={githubStagger}
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView={prefersReducedMotion ? undefined : "show"}
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div
            className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between"
            variants={itemVariants}
          >
            <div>
              <p
                className={`text-sm font-medium uppercase tracking-[0.18em] ${
                  isDark ? "text-cyan-300" : "text-cyan-700"
                }`}
              >
                GitHub
              </p>
              <h2 className="mt-2 text-2xl font-semibold md:text-3xl">
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
              className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] transition ${
                isDark
                  ? "border-cyan-700/70 text-cyan-200 hover:bg-cyan-900/30"
                  : "border-cyan-300 text-cyan-800 hover:bg-cyan-100/70"
              }`}
            >
              View Profile
            </motion.a>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className={`overflow-hidden rounded-2xl border p-4 ${
              isDark
                ? "border-slate-700 bg-slate-950/40"
                : "border-slate-200 bg-white/90"
            }`}
          >
            <motion.img
              src={githubCalendarUrl}
              alt={`${githubUsername} GitHub contributions graph for the past year`}
              className="block h-auto w-full"
              initial={prefersReducedMotion ? false : { opacity: 0.85, scale: 0.985 }}
              whileInView={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5 }}
            />
          </motion.div>
        </motion.div>
      </div>
    </MotionSection>
  );
}
