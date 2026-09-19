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
        <header className="personal-section-header space-y-4">
          {title ? (
            <h2 className="">
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
