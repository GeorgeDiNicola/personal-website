import type { Skill } from "./types";

type SkillsSectionProps = {
  isDark: boolean;
  skills: Skill[];
};

export function SkillsSection({ isDark, skills }: SkillsSectionProps) {
  return (
    <section className="mt-10">
      <div
        className={`relative overflow-hidden rounded-3xl border p-6 md:p-8 ${
          isDark
            ? "border-slate-700 bg-slate-900/70"
            : "border-cyan-100 bg-gradient-to-br from-white via-cyan-50 to-amber-50"
        }`}
      >
        <div
          className={`pointer-events-none absolute -top-20 left-1/3 h-44 w-44 rounded-full blur-3xl ${
            isDark ? "bg-cyan-500/10" : "bg-cyan-300/30"
          }`}
        />
        <div className="relative">
          <p
            className={`text-sm font-medium uppercase tracking-[0.18em] ${
              isDark ? "text-cyan-300" : "text-cyan-700"
            }`}
          >
            Skills
          </p>
          <h2 className="mt-3 text-2xl font-semibold md:text-3xl">
            Technical Toolkit
          </h2>
          <p
            className={`mt-3 max-w-3xl text-sm leading-relaxed ${
              isDark ? "text-slate-300" : "text-slate-700"
            }`}
          >
            Core technologies I use for backend systems, infrastructure, data
            workflows, and frontend development.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
            {skills.map((skill) => (
              <article
                key={skill.name}
                className={`rounded-2xl border p-3 text-center ${
                  isDark
                    ? "border-slate-700 bg-slate-900/80"
                    : "border-slate-200 bg-white/90"
                }`}
              >
                <div
                  className={`mx-auto flex h-12 w-12 items-center justify-center rounded-xl ${
                    isDark ? "bg-slate-800" : "bg-slate-100"
                  }`}
                >
                  <img
                    src={skill.logo}
                    alt={`${skill.name} logo`}
                    loading="lazy"
                    className="h-7 w-7 object-contain"
                  />
                </div>
                <p
                  className={`mt-2 text-xs font-semibold md:text-sm ${
                    isDark ? "text-slate-200" : "text-slate-800"
                  }`}
                >
                  {skill.name}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
