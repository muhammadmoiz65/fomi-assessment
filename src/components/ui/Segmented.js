"use client";

import { cn } from "@/lib/utils";
import Icon from "./Icon";

/**
 * Segmented control (e.g. Image / Video). Renders as a radio group with
 * a sliding highlight; fully keyboard operable via the native radios.
 */
export default function Segmented({
  options,
  value,
  onChange,
  name = "segment",
  size = "md",
  className = "",
}) {
  const activeIndex = Math.max(
    0,
    options.findIndex((o) => o.value === value)
  );
  const pad = size === "sm" ? "p-0.5" : "p-1";

  return (
    <div
      role="radiogroup"
      aria-label={name}
      className={cn(
        "relative inline-grid rounded-xl bg-surface-sunken",
        pad,
        className
      )}
      style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}
    >
      {/* sliding highlight */}
      <span
        aria-hidden="true"
        className="absolute rounded-lg bg-surface card-shadow transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          top: size === "sm" ? 2 : 4,
          bottom: size === "sm" ? 2 : 4,
          left: size === "sm" ? 2 : 4,
          width: `calc((100% - ${size === "sm" ? "4px" : "8px"}) / ${options.length})`,
          transform: `translateX(${activeIndex * 100}%)`,
        }}
      />
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <label
            key={opt.value}
            className={cn(
              "relative z-10 flex cursor-pointer items-center justify-center gap-1.5 rounded-lg font-medium transition-colors",
              size === "sm" ? "h-7 px-3 text-xs" : "h-9 px-4 text-sm",
              selected ? "text-text" : "text-text-muted hover:text-text"
            )}
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={selected}
              onChange={() => onChange(opt.value)}
              className="sr-only"
            />
            {opt.icon && <Icon name={opt.icon} className="size-4" />}
            {opt.label}
          </label>
        );
      })}
    </div>
  );
}
