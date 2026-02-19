import type { Project } from "./types";

type ProjectsSectionProps = {
  isDark: boolean;
  projects: Project[];
};

export function ProjectsSection({ isDark, projects }: ProjectsSectionProps) {
  return (
    <section className="mt-12">
      <div
        className={`relative overflow-hidden rounded-3xl border p-6 md:p-8 ${
          isDark
            ? "border-slate-700 bg-slate-900/70"
            : "border-cyan-100 bg-gradient-to-br from-white via-cyan-50 to-amber-50"
        }`}
      >
        <div
          className={`pointer-events-none absolute -top-24 -right-10 h-56 w-56 rounded-full blur-3xl ${
            isDark ? "bg-cyan-500/10" : "bg-cyan-300/30"
          }`}
        />
        <div
          className={`pointer-events-none absolute -bottom-24 -left-8 h-56 w-56 rounded-full blur-3xl ${
            isDark ? "bg-amber-500/10" : "bg-amber-200/40"
          }`}
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

          <div className="lg:col-span-8">
            <div className="grid gap-4 sm:grid-cols-2">
              {projects.map((project) => (
                <article
                  key={project.title}
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
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`mt-4 inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] transition ${
                        isDark
                          ? "border-cyan-700/70 text-cyan-200 hover:bg-cyan-900/30"
                          : "border-cyan-300 text-cyan-800 hover:bg-cyan-100/70"
                      }`}
                    >
                      See Project
                    </a>
                  )}
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
