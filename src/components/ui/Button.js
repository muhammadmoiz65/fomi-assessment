"use client";

import { cn } from "@/lib/utils";

const VARIANTS = {
  primary:
    "bg-accent text-[var(--accent-contrast)] hover:bg-accent-hover active:bg-accent-press shadow-[0_6px_16px_-6px_var(--ring)]",
  secondary:
    "bg-surface text-text border border-[var(--border-strong)] hover:bg-surface-soft",
  soft: "bg-accent-soft text-accent hover:brightness-[0.97]",
  ghost: "text-text-muted hover:text-text hover:bg-surface-soft",
  outline:
    "border border-[var(--border-strong)] text-text hover:border-accent hover:text-accent",
};

const SIZES = {
  sm: "h-8 px-3 text-xs gap-1.5 rounded-lg",
  md: "h-10 px-4 text-sm gap-2 rounded-xl",
  lg: "h-12 px-5 text-sm gap-2 rounded-xl",
};

/**
 * The single button primitive used across the app. Handles variants,
 * sizes, a loading spinner, and keeps disabled/aria states consistent.
 */
export default function Button({
  as: Tag = "button",
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  children,
  ...rest
}) {
  const isDisabled = disabled || loading;
  return (
    <Tag
      className={cn(
        "inline-flex items-center justify-center font-medium select-none",
        "transition-all duration-200 active:scale-[0.98] cursor-pointer",
        "disabled:opacity-50 disabled:pointer-events-none",
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      disabled={Tag === "button" ? isDisabled : undefined}
      aria-busy={loading || undefined}
      aria-disabled={isDisabled || undefined}
      {...rest}
    >
      {loading && (
        <span
          className="size-4 rounded-full border-2 border-current border-t-transparent"
          style={{ animation: "fomi-spin 0.7s linear infinite" }}
          aria-hidden="true"
        />
      )}
      {children}
    </Tag>
  );
}
