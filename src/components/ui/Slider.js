"use client";

import { cn } from "@/lib/utils";

/**
 * Labeled range slider with a live value readout. The filled track is
 * painted via a gradient driven by the current value for instant feedback.
 */
export default function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  hint,
  format = (v) => v,
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <label className="text-xs font-medium text-text">{label}</label>
        <span className="font-mono text-xs text-text-muted">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        className={cn(
          "h-1.5 w-full cursor-pointer appearance-none rounded-full outline-none",
          "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-4",
          "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent",
          "[&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-surface",
          "[&::-webkit-slider-thumb]:shadow-[0_2px_6px_-1px_var(--ring)]",
          "[&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:active:scale-110",
          "[&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full",
          "[&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-surface",
          "[&::-moz-range-thumb]:bg-accent [&::-moz-range-thumb]:border-solid"
        )}
        style={{
          background: `linear-gradient(to right, var(--accent) ${pct}%, var(--surface-sunken) ${pct}%)`,
        }}
      />
      {hint && <p className="mt-1 text-[11px] text-text-subtle">{hint}</p>}
    </div>
  );
}
