/**
 * @module useTheme
 * Manages light / dark / system colour-scheme preference.
 * Persists the choice to `localStorage` and applies the Tailwind
 * `dark` class to `<html>` so all `dark:` utilities activate.
 */

import { useState, useEffect, useCallback } from "react";

/** Supported theme values — `"system"` follows OS preference. */
export type Theme = "light" | "dark" | "system";

/**
 * Resolve the OS-level preferred colour scheme.
 * @returns `"dark"` or `"light"` based on the `prefers-color-scheme` media query.
 */
function getSystemTheme(): "light" | "dark" {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/**
 * Toggle the `dark` class on the root `<html>` element based on the resolved theme.
 * @param theme - The user-selected theme (may be `"system"`).
 */
function applyTheme(theme: Theme) {
  const resolved = theme === "system" ? getSystemTheme() : theme;
  document.documentElement.classList.toggle("dark", resolved === "dark");
}

/**
 * React hook for theme management.
 *
 * @returns An object with:
 *  - `theme`         — the raw stored value (`"light"` | `"dark"` | `"system"`).
 *  - `setTheme`      — update & persist the preference.
 *  - `resolvedTheme` — the effective value after resolving `"system"`.
 */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem("fleet-flow-theme") as Theme | null;
    return saved ?? "light";
  });

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    localStorage.setItem("fleet-flow-theme", t);
    applyTheme(t);
  }, []);

  // Apply on mount & listen for system changes
  useEffect(() => {
    applyTheme(theme);
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (theme === "system") applyTheme("system");
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  const resolvedTheme: "light" | "dark" =
    theme === "system" ? getSystemTheme() : theme;

  return { theme, setTheme, resolvedTheme };
}
