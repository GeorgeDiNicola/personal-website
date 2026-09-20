import { afterEach, expect, it, vi } from "vitest";
import { installMediaQueries } from "@/tests/helpers/media";
import { homepageIntroBootScript } from "./homepageIntro";

function boot(path = "/") {
  history.replaceState(null, "", path);
  vi.stubGlobal("CSS", { supports: () => true });
  vi.spyOn(performance, "getEntriesByType").mockReturnValue([]);
  window.eval(homepageIntroBootScript);
}

afterEach(() => {
  // Abort the boot script's listeners before restoring the test environment.
  window.dispatchEvent(new Event("pagehide"));
  history.replaceState(null, "", "/");
});

it.each(["keydown", "pointerdown", "focusin", "wheel", "touchmove", "scroll", "pagehide"])("lets %s interrupt the introduction", (event) => {
  boot();
  expect(document.documentElement).toHaveAttribute("data-home-intro", "playing");
  window.dispatchEvent(new Event(event));
  expect(document.documentElement).not.toHaveAttribute("data-home-intro");
});

it.each(["/personal/", "/#projects"])("does not delay reading on %s", (path) => {
  boot(path);
  expect(document.documentElement).not.toHaveAttribute("data-home-intro");
});

it("respects reduced motion and stops when that preference changes", () => {
  const change = installMediaQueries({ "(prefers-reduced-motion: reduce)": true });
  boot();
  expect(document.documentElement).not.toHaveAttribute("data-home-intro");
  change("(prefers-reduced-motion: reduce)", false);
  boot();
  change("(prefers-reduced-motion: reduce)", true);
  expect(document.documentElement).not.toHaveAttribute("data-home-intro");
});

it("reveals content even if animation completion never arrives", () => {
  vi.useFakeTimers();
  boot();
  vi.advanceTimersByTime(3_000);
  expect(document.documentElement).not.toHaveAttribute("data-home-intro");
});

it("finishes only on the designated animation or when the document becomes hidden", () => {
  boot();
  const element = document.createElement("div");
  document.body.append(element);
  element.dispatchEvent(new Event("animationend", { bubbles: true }));
  expect(document.documentElement).toHaveAttribute("data-home-intro");
  element.setAttribute("data-intro-finish", "");
  element.dispatchEvent(new Event("animationend", { bubbles: true }));
  expect(document.documentElement).not.toHaveAttribute("data-home-intro");
  element.remove();
  boot();
  document.dispatchEvent(new Event("visibilitychange"));
  expect(document.documentElement).not.toHaveAttribute("data-home-intro");
});
