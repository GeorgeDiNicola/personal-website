type SectionCardProps = {
  id: string;
  title: string;
  subtitle?: string;
  isDark: boolean;
  children: React.ReactNode;
};

export function SectionCard({ id, title, subtitle, isDark, children }: SectionCardProps) {
  return (
    <section
      id={id}
      className={`rounded-3xl border p-6 md:p-8 ${
        isDark
          ? "border-slate-700 bg-slate-900/70"
          : "border-cyan-100 bg-gradient-to-br from-white via-cyan-50 to-amber-50"
      }`}
    >
      <header className="mb-4 space-y-1 text-center">
        <h2 className="text-2xl font-bold md:text-3xl">{title}</h2>
        {subtitle ? (
          <p className={isDark ? "text-slate-300" : "text-slate-700"}>{subtitle}</p>
        ) : null}
      </header>
      {children}
    </section>
  );
}
