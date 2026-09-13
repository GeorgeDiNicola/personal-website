const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").trim().replace(/^\/+|\/+$/g, "");
const homepagePath = basePath ? `/${basePath}/` : "/";

// Runs before the homepage is painted, independently of React hydration. Content
// is visible by default if scripts, storage, or CSS animations are unavailable.
export const homepageIntroBootScript = `
(() => {
  if (location.pathname.replace(/\\/?$/, "/") !== ${JSON.stringify(homepagePath)}) return;
  const root = document.documentElement;
  const attribute = "data-home-intro";
  const safetyTimeout = 3000;
  try {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const navigation = performance.getEntriesByType("navigation")[0];
    if (
      reducedMotion.matches ||
      location.hash || window.scrollY > 0 ||
      navigation?.type === "back_forward" ||
      document.visibilityState === "hidden" ||
      !CSS.supports("animation-name", "home-intro")
    ) return;

    const controller = new AbortController();
    const options = { signal: controller.signal, passive: true, capture: true };
    const finish = () => {
      root.removeAttribute(attribute);
      controller.abort();
      window.clearTimeout(timeout);
    };
    const timeout = window.setTimeout(finish, safetyTimeout);

    // Intent to navigate or read takes precedence over the introduction.
    for (const event of ["keydown", "pointerdown", "focusin", "wheel", "touchmove", "scroll", "pagehide"]) {
      window.addEventListener(event, finish, options);
    }
    reducedMotion.addEventListener("change", finish, options);
    document.addEventListener("visibilitychange", finish, options);
    document.addEventListener("animationend", (event) => {
      if (event.target instanceof Element && event.target.hasAttribute("data-intro-finish")) finish();
    }, options);

    root.setAttribute(attribute, "playing");
  } catch {
    root.removeAttribute(attribute);
  }
})();
`;
