"use client";

import { useState } from "react";
import { MODELS } from "@/lib/constants";
import Icon from "@/components/ui/Icon";
import { timeAgo } from "@/lib/utils";

/**
 * Header for one generation batch — the prompt + settings that produced
 * the results beneath it (the mockup's "description card", made useful).
 * Each batch renders its own, so results never get confused across prompts.
 */
export default function ActivePromptCard({ active }) {
  const [copied, setCopied] = useState(false);
  if (!active) return null;

  const model = MODELS.find((m) => m.id === active.model) || MODELS[0];
  const unit = active.mode === "video" ? "clip" : "image";
  const n = active.items ? active.items.length : active.count;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(active.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-surface-soft p-4">
      <div className="mb-2 flex flex-wrap items-center gap-1.5">
        <span className="flex items-center gap-1.5 rounded-full bg-surface px-2.5 py-1 text-[11px] font-medium text-text">
          <Icon name="layers" className="size-3.5 text-accent" />
          {model.name}
        </span>
        {n != null && (
          <span className="rounded-full bg-surface px-2.5 py-1 text-[11px] font-medium text-text-muted">
            {n} {n === 1 ? unit : `${unit}s`}
          </span>
        )}
        <span className="rounded-full bg-surface px-2.5 py-1 text-[11px] font-medium text-text-muted">
          {active.ratio}
        </span>
        {active.createdAt && (
          <span className="flex items-center gap-1 rounded-full bg-surface px-2.5 py-1 text-[11px] font-medium text-text-muted">
            <Icon name="clock" className="size-3" />
            {timeAgo(active.createdAt)}
          </span>
        )}
        <button
          type="button"
          onClick={copy}
          className="ml-auto flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] text-text-muted transition-colors hover:text-accent cursor-pointer"
          aria-label="Copy prompt"
        >
          <Icon name={copied ? "check" : "copy"} className="size-3.5" />
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <p className="text-sm leading-relaxed text-text/90">{active.prompt}</p>
    </div>
  );
}
