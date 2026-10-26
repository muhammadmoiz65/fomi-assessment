"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import Icon from "@/components/ui/Icon";

/** Sun/moon toggle — the moon control shown in the mockup's top bar. */
export default function ThemeToggle({ className = "" }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Light mode" : "Dark mode"}
      className={
        "relative grid size-9 place-items-center rounded-xl text-text-muted " +
        "transition-colors hover:bg-surface-soft hover:text-text cursor-pointer " +
        className
      }
    >
      <Icon
        name="sun"
        className={`absolute size-[18px] transition-all duration-300 ${
          isDark ? "scale-0 -rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
        }`}
      />
      <Icon
        name="moon"
        className={`absolute size-[18px] transition-all duration-300 ${
          isDark ? "scale-100 rotate-0 opacity-100" : "scale-0 rotate-90 opacity-0"
        }`}
      />
    </button>
  );
}
