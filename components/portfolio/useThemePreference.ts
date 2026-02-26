"use client";

import { useEffect, useSyncExternalStore } from "react";

import type { Theme } from "@/components/portfolio/types";

const THEME_STORAGE_KEY = "theme";
const THEME_CHANGED_EVENT = "theme-change";

const getStoredTheme = (): Theme | null => {
  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  return storedTheme === "light" || storedTheme === "dark" ? storedTheme : null;
};

const getThemeSnapshot = (): Theme => {
  const storedTheme = getStoredTheme();
  if (storedTheme) return storedTheme;

  return "dark";
};

const subscribeTheme = (onStoreChange: () => void) => {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  const handleStorage = (event: StorageEvent) => {
    if (event.key === THEME_STORAGE_KEY) onStoreChange();
  };

  const handleMediaChange = () => {
    if (!getStoredTheme()) onStoreChange();
  };

  const handleThemeChange = () => onStoreChange();

  window.addEventListener("storage", handleStorage);
  mediaQuery.addEventListener("change", handleMediaChange);
  window.addEventListener(THEME_CHANGED_EVENT, handleThemeChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    mediaQuery.removeEventListener("change", handleMediaChange);
    window.removeEventListener(THEME_CHANGED_EVENT, handleThemeChange);
  };
};

export function useThemePreference() {
  const theme = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    () => "dark"
  );

  const setTheme = (nextTheme: Theme) => {
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    window.dispatchEvent(new Event(THEME_CHANGED_EVENT));
  };

  useEffect(() => {
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  return { theme, setTheme, isDark: theme === "dark" };
}
