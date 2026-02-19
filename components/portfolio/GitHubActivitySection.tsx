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
          className={`pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full blur-3xl ${
            isDark ? "bg-cyan-500/10" : "bg-cyan-300/30"
          }`}
        />
        <div className="relative space-y-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
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
            <a
              href={githubProfileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] transition ${
                isDark
                  ? "border-cyan-700/70 text-cyan-200 hover:bg-cyan-900/30"
                  : "border-cyan-300 text-cyan-800 hover:bg-cyan-100/70"
              }`}
            >
              View Profile
            </a>
          </div>

          <div
            className={`overflow-hidden rounded-2xl border p-4 ${
              isDark
                ? "border-slate-700 bg-slate-950/40"
                : "border-slate-200 bg-white/90"
            }`}
          >
            <img
              src={githubCalendarUrl}
              alt={`${githubUsername} GitHub contributions graph for the past year`}
              className="block h-auto w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
