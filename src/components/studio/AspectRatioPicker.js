"use client";

import { ASPECT_RATIOS } from "@/lib/constants";
import { cn } from "@/lib/utils";

/** Visual aspect-ratio selector — each option previews its proportions. */
export default function AspectRatioPicker({ value, onChange }) {
  return (
    <div role="radiogroup" aria-label="Aspect ratio" className="flex flex-wrap gap-2">
      {ASPECT_RATIOS.map((r) => {
        const selected = r.id === value;
        return (
          <button
            key={r.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(r.id)}
            title={`${r.label} (${r.id})`}
            className={cn(
              "flex flex-col items-center gap-1.5 rounded-xl border px-3 py-2 transition-all duration-200 cursor-pointer active:scale-95",
              selected
                ? "border-accent bg-accent-soft"
                : "border-[var(--border)] bg-surface hover:border-[var(--border-strong)]"
            )}
          >
            <span
              className={cn(
                "block rounded-[3px] border",
                selected ? "border-accent bg-accent/15" : "border-text-subtle"
              )}
              style={{
                width: r.w >= r.h ? 22 : (22 * r.w) / r.h,
                height: r.h >= r.w ? 22 : (22 * r.h) / r.w,
              }}
            />
            <span
              className={cn(
                "text-[10px] font-medium",
                selected ? "text-accent" : "text-text-muted"
              )}
            >
              {r.id}
            </span>
          </button>
        );
      })}
    </div>
  );
}
