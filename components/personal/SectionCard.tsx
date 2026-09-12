type SectionCardProps = {
  id: string;
  title?: string;
  ariaLabel?: string;
  subtitle?: string;
  isDark: boolean;
  children: React.ReactNode;
};

export function SectionCard({ id, title, ariaLabel, subtitle, isDark, children }: SectionCardProps) {
  void isDark;

  return (
    <section
      id={id}
      aria-label={ariaLabel}
      className="portfolio-surface"
    >
      {title || subtitle ? (
        <header className="mb-5 space-y-2 text-center">
          {title ? (
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              {title}
            </h2>
          ) : null}
          {subtitle ? (
            <p className="portfolio-copy mx-auto max-w-3xl">{subtitle}</p>
          ) : null}
        </header>
      ) : null}
      {children}
    </section>
  );
}
