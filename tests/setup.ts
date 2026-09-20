import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach, vi } from "vitest";
import { installMediaQueries } from "./helpers/media";

beforeEach(() => {
  installMediaQueries();
  vi.stubGlobal("IntersectionObserver", class {
    observe() {}
    unobserve() {}
    disconnect() {}
  });
  vi.spyOn(HTMLElement.prototype, "scrollTo").mockImplementation(() => {});
});

// jsdom has no layout or scrolling. Browser tests verify those contracts.
Object.defineProperty(HTMLElement.prototype, "scrollTo", {
  configurable: true,
  value: () => {},
  writable: true,
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
  localStorage.clear();
  document.documentElement.removeAttribute("style");
  document.documentElement.removeAttribute("data-theme");
  document.documentElement.removeAttribute("data-home-intro");
  document.body.removeAttribute("style");
  document.body.className = "";
});
