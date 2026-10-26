"use client";

import { PROMPT_SUGGESTIONS } from "@/lib/constants";
import Icon from "@/components/ui/Icon";

/** Shown before the first generation — beats the blank canvas with ideas. */
export default function EmptyState({ onPick }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-3xl border border-dashed border-[var(--border-strong)] bg-surface/40 p-8 text-center">
      <div className="animate-float mb-5 grid size-16 place-items-center rounded-2xl bg-accent-soft text-accent">
        <Icon name="sparkle" className="size-8" />
      </div>
      <h2 className="text-lg font-semibold text-text">Your canvas is ready</h2>
      <p className="mt-1.5 max-w-sm text-sm text-text-muted">
        Describe an idea on the left and hit Generate. Not sure where to start?
        Try one of these:
      </p>
      <div className="mt-5 flex max-w-lg flex-wrap justify-center gap-2">
        {PROMPT_SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onPick?.(s)}
            className="rounded-full border border-[var(--border)] bg-surface px-3.5 py-2 text-left text-xs text-text-muted transition-all duration-200 hover:border-accent hover:text-accent hover:shadow-[0_4px_12px_-6px_var(--ring)] active:scale-95 cursor-pointer"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
