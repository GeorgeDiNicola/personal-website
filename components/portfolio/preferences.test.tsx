import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { installMediaQueries } from "@/tests/helpers/media";
import { useThemePreference } from "./useThemePreference";
import { resolveTextColorValue, TEXT_COLOR_PALETTE, useTextColorPreference, type TextColor } from "./useTextColorPreference";
import type { Theme } from "./types";
import { useHydratedReducedMotion } from "./motion/useHydratedReducedMotion";
import { useResponsiveViewport } from "./motion/useResponsiveViewport";

describe("theme preference", () => {
  it("follows system changes until the visitor chooses a theme", () => {
    const changeMedia = installMediaQueries();
    const { result, unmount } = renderHook(useThemePreference);
    expect(result.current.theme).toBe("light");
    act(() => changeMedia("(prefers-color-scheme: dark)", true));
    expect(result.current.isDark).toBe(true);
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    act(() => result.current.setTheme("light"));
    expect(localStorage.getItem("theme")).toBe("light");
    act(() => changeMedia("(prefers-color-scheme: dark)", true));
    expect(result.current.theme).toBe("light");
    expect(document.documentElement.style.colorScheme).toBe("light");
    unmount();
    expect(renderHook(useThemePreference).result.current.theme).toBe("light");
  });

  it("ignores invalid saved values and responds to another tab", () => {
    localStorage.setItem("theme", "invalid");
    const { result } = renderHook(useThemePreference);
    expect(result.current.theme).toBe("light");
    act(() => {
      localStorage.setItem("theme", "dark");
      window.dispatchEvent(new StorageEvent("storage", { key: "unrelated" }));
    });
    expect(result.current.theme).toBe("light");
    act(() => window.dispatchEvent(new StorageEvent("storage", { key: "theme" })));
    expect(result.current.theme).toBe("dark");
  });
});

describe("text color preference", () => {
  it.each(["default", ...Object.keys(TEXT_COLOR_PALETTE)] as TextColor[])("persists %s and adapts to theme changes", (color) => {
    const { result, rerender, unmount } = renderHook(
      ({ theme }: { theme: Theme }) => useTextColorPreference(theme),
      { initialProps: { theme: "light" as Theme } },
    );
    act(() => result.current.setTextColor(color));
    expect(localStorage.getItem("text-color")).toBe(color);
    rerender({ theme: "dark" });
    if (color !== "default") {
      expect(document.documentElement.style.getPropertyValue("--site-text-color")).toBe(resolveTextColorValue(color, "dark"));
      expect(document.body).toHaveClass("site-text-color-active");
    }
    unmount();
    expect(renderHook(() => useTextColorPreference("dark")).result.current.textColor).toBe(color);
  });

  it("recovers from invalid storage, synchronizes tabs, and resets styles", () => {
    localStorage.setItem("text-color", "invalid");
    const { result } = renderHook(() => useTextColorPreference("light"));
    expect(result.current.textColor).toBe("default");
    act(() => {
      localStorage.setItem("text-color", "blue");
      window.dispatchEvent(new StorageEvent("storage", { key: "other" }));
    });
    expect(result.current.textColor).toBe("default");
    act(() => window.dispatchEvent(new StorageEvent("storage", { key: "text-color" })));
    expect(result.current.textColor).toBe("blue");
    act(() => result.current.setTextColor("default"));
    expect(document.body).not.toHaveClass("site-text-color-active");
    expect(document.documentElement.style.getPropertyValue("--site-text-color")).toBe("");
    expect(resolveTextColorValue("default", "light")).not.toBe(resolveTextColorValue("default", "dark"));
  });
});

it("responds to motion and viewport changes without remounting", () => {
  const changeMedia = installMediaQueries();
  const motion = renderHook(useHydratedReducedMotion);
  const viewport = renderHook(useResponsiveViewport);
  expect(motion.result.current).toBe(false);
  expect(viewport.result.current.isMobile).toBe(false);
  const desktop = viewport.result.current.viewportFor(0.5);
  act(() => {
    changeMedia("(prefers-reduced-motion: reduce)", true);
    changeMedia("(max-width: 768px)", true);
  });
  expect(motion.result.current).toBe(true);
  expect(viewport.result.current.isMobile).toBe(true);
  expect(viewport.result.current.viewportFor(0.5).amount).toBeLessThan(desktop.amount);
  expect(viewport.result.current.viewportFor(0.5, 0.1, false)).toMatchObject({ amount: 0.1, once: false });
});
