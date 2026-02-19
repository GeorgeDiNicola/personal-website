import Image from "next/image";

type HeroSectionProps = {
  isDark: boolean;
};

export function HeroSection({ isDark }: HeroSectionProps) {
  return (
    <section className="relative">
      <div
        className={`pointer-events-none absolute -top-14 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full blur-3xl ${
          isDark ? "bg-cyan-500/15" : "bg-cyan-300/40"
        }`}
      />
      <div
        className={`relative mx-auto max-w-4xl overflow-hidden rounded-[2rem] border px-6 py-10 text-center md:px-12 md:py-14 ${
          isDark
            ? "border-slate-700 bg-slate-900/75"
            : "border-cyan-100 bg-gradient-to-br from-white via-cyan-50 to-amber-50"
        }`}
      >
        <div
          className={`pointer-events-none absolute inset-0 opacity-70 ${
            isDark
              ? "bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.15),transparent_55%)]"
              : "bg-[radial-gradient(circle_at_top,rgba(14,116,144,0.16),transparent_55%)]"
          }`}
        />
        <div className="relative flex flex-col items-center gap-5">
          <div className="relative">
            <div
              className={`absolute -inset-1 rounded-full blur-sm ${
                isDark
                  ? "bg-gradient-to-br from-cyan-300/50 to-amber-200/40"
                  : "bg-gradient-to-br from-cyan-500/45 to-amber-400/45"
              }`}
            />
            <Image
              src="/me.jpg"
              alt="Apple Genmoji"
              width={168}
              height={168}
              priority
              className={`relative h-32 w-32 rounded-full object-cover md:h-40 md:w-40 ${
                isDark ? "border-2 border-slate-800" : "border-2 border-white"
              }`}
            />
          </div>

          <p
            className={`text-sm font-medium uppercase tracking-[0.2em] ${
              isDark ? "text-cyan-300" : "text-cyan-700"
            }`}
          >
            Personal Portfolio
          </p>
          <h1 className="text-3xl font-bold leading-tight md:text-5xl">
            George DiNicola
          </h1>
          <div className="max-w-3xl space-y-3">
            <h2 className="text-xl font-semibold md:text-2xl">About Me</h2>
            <p
              className={`text-base leading-relaxed md:text-lg ${
                isDark ? "text-slate-300" : "text-slate-700"
              }`}
            >
              Software Engineer with 3+ years of experience. I specialize in
              production backend systems and data infrastructure, with a deep
              interest in distributed systems and machine learning.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
