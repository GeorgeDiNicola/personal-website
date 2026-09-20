const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").trim().replace(/^\/+|\/+$/g, "");

/** Return to the project section through native fragment navigation. */
export function BackToProjectsLink() {
  // Next's cached route can retain the entry fragment and append it again.
  // Native navigation keeps this cross-page anchor reliable on static hosting.
  const href = `${basePath ? `/${basePath}` : ""}/#projects`;

  return (
    <a href={href} className="portfolio-action mb-6 px-4 py-2 text-sm">
      <span aria-hidden="true" className="site-text-static">←</span>
      <span className="site-text-static">Back to projects</span>
    </a>
  );
}
