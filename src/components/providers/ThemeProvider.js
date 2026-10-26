"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { appConfig } from "@/config/app.config";

const ThemeContext = createContext({ theme: "light", toggleTheme: () => {} });

/**
 * Theme state lives here. The actual <html data-theme> attribute is set
 * pre-paint by an inline script in the root layout (no flash); this
 * provider keeps React in sync and persists the user's choice.
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(appConfig.theme.default);

  // Sync React with the theme the inline bootstrap applied before paint.
  // This runs post-mount on purpose (reading the DOM during render would
  // break SSR/hydration), so the one-time setState here is intentional.
  useEffect(() => {
    const current =
      document.documentElement.getAttribute("data-theme") ||
      appConfig.theme.default;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(current);
  }, []);

  const apply = (next) => {
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(appConfig.theme.storageKey, next);
    } catch {}
  };

  const toggleTheme = () => apply(theme === "dark" ? "light" : "dark");

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme: apply }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
