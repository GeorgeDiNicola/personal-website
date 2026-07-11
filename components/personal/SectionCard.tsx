type SectionCardProps = {
  id: string;
  title: string;
  subtitle?: string;
  isDark: boolean;
  children: React.ReactNode;
};

export function SectionCard({ id, title, subtitle, isDark, children }: SectionCardProps) {
  void isDark;

  return (
    <section
      id={id}
      className="portfolio-surface"
    >
      <header className="mb-5 space-y-2 text-center">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          {title}
        </h2>
        {subtitle ? (
          <p className="portfolio-copy mx-auto max-w-3xl">{subtitle}</p>
        ) : null}
      </header>
      {children}
    </section>
  );
}
