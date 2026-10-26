"use client";

import { cn } from "@/lib/utils";
import Icon from "./Icon";

const SIZES = {
  sm: "size-8 rounded-lg",
  md: "size-10 rounded-xl",
};

const VARIANTS = {
  surface:
    "bg-surface border border-[var(--border)] text-text-muted hover:text-text hover:border-[var(--border-strong)]",
  ghost: "text-text-muted hover:text-text hover:bg-surface-soft",
  glass:
    "bg-black/35 text-white backdrop-blur-sm hover:bg-black/55 border border-white/10",
  accent: "bg-accent text-[var(--accent-contrast)] hover:bg-accent-hover",
};

/**
 * Square icon-only button. `label` is required and becomes the accessible
 * name (also surfaced as a native tooltip) so every control stays reachable.
 */
export default function IconButton({
  icon,
  label,
  size = "md",
  variant = "surface",
  active = false,
  className = "",
  ...rest
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={active || undefined}
      className={cn(
        "inline-flex items-center justify-center transition-all duration-200",
        "active:scale-90 cursor-pointer disabled:opacity-40 disabled:pointer-events-none",
        SIZES[size],
        VARIANTS[variant],
        active && "!text-accent !border-accent bg-accent-soft",
        className
      )}
      {...rest}
    >
      <Icon name={icon} className={size === "sm" ? "size-4" : "size-[18px]"} />
    </button>
  );
}
