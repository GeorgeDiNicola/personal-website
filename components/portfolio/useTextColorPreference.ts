"use client";

import { useEffect, useSyncExternalStore } from "react";

import type { Theme } from "@/components/portfolio/types";

export type TextColor = "default" | "purple" | "yellow" | "pink" | "green" | "blue";

const TEXT_COLOR_STORAGE_KEY = "text-color";
const TEXT_COLOR_CHANGED_EVENT = "text-color-change";

const MODE_DEFAULT_TEXT_COLOR: Record<Theme, string> = {
  dark: "#f1f4f7",
  light: "#1d252d"
};

// Keep the stored keys stable when refining the displayed palette.
export const TEXT_COLOR_PALETTE: Record<
  Exclude<TextColor, "default">,
  { label: string; light: string; dark: string }
> = {
  purple: { label: "Violet", light: "#6d28a8", dark: "#c4b5fd" },
  yellow: { label: "Amber", light: "#854d0e", dark: "#f0cd83" },
  pink: { label: "Rose", light: "#a12c58", dark: "#efa6bd" },
  green: { label: "Teal", light: "#126757", dark: "#8dd3bb" },
  blue: { label: "Blue", light: "#245b91", dark: "#9bc5eb" }
};

const getStoredTextColor = (): TextColor | null => {
  const storedTextColor = window.localStorage.getItem(TEXT_COLOR_STORAGE_KEY);

  if (
    storedTextColor === "default" ||
    storedTextColor === "purple" ||
    storedTextColor === "yellow" ||
    storedTextColor === "pink" ||
    storedTextColor === "green" ||
    storedTextColor === "blue"
  ) {
    return storedTextColor;
  }

  return null;
};

const getTextColorSnapshot = (): TextColor => getStoredTextColor() ?? "default";

/** Resolve the same theme-aware shade for body text and its picker swatch. */
export const resolveTextColorValue = (textColor: TextColor, theme: Theme) => {
  if (textColor === "default") return MODE_DEFAULT_TEXT_COLOR[theme];
  return TEXT_COLOR_PALETTE[textColor][theme];
};

const subscribeTextColor = (onStoreChange: () => void) => {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === TEXT_COLOR_STORAGE_KEY) onStoreChange();
  };

  const handleTextColorChange = () => onStoreChange();

  window.addEventListener("storage", handleStorage);
  window.addEventListener(TEXT_COLOR_CHANGED_EVENT, handleTextColorChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(TEXT_COLOR_CHANGED_EVENT, handleTextColorChange);
  };
};

export function useTextColorPreference(theme: Theme) {
  const textColor = useSyncExternalStore<TextColor>(
    subscribeTextColor,
    getTextColorSnapshot,
    (): TextColor => "default"
  );

  const setTextColor = (nextTextColor: TextColor) => {
    window.localStorage.setItem(TEXT_COLOR_STORAGE_KEY, nextTextColor);
    window.dispatchEvent(new Event(TEXT_COLOR_CHANGED_EVENT));
  };

  useEffect(() => {
    if (textColor === "default") {
      document.body.classList.remove("site-text-color-active");
      document.documentElement.style.removeProperty("--site-text-color");
      return;
    }

    document.documentElement.style.setProperty(
      "--site-text-color",
      resolveTextColorValue(textColor, theme)
    );
    document.body.classList.add("site-text-color-active");
  }, [textColor, theme]);

  return { textColor, setTextColor };
}
