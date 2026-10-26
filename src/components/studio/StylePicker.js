"use client";

import { STYLES } from "@/lib/constants";
import { cn } from "@/lib/utils";

/** Row of selectable style chips. Single-select, keyboard reachable. */
export default function StylePicker({ value, onChange }) {
  return (
    <div role="radiogroup" aria-label="Style" className="flex flex-wrap gap-2">
      {STYLES.map((s) => {
        const selected = s.id === value;
        return (
          <button
            key={s.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(s.id)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer active:scale-95",
              selected
                ? "border-accent bg-accent-soft text-accent"
                : "border-[var(--border)] bg-surface text-text-muted hover:border-[var(--border-strong)] hover:text-text"
            )}
          >
            {s.label}
          </button>
        );
      })}
    </div>
  );
}
