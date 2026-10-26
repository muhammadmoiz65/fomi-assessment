"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/utils";
import Icon from "./Icon";

/**
 * Accordion section. Uses the grid-rows 0fr→1fr technique so it animates
 * height smoothly without measuring the DOM.
 */
export default function Collapsible({
  title,
  icon,
  defaultOpen = false,
  badge,
  children,
}) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-surface">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2.5 px-4 py-3 text-left transition-colors hover:bg-surface-soft cursor-pointer"
      >
        {icon && <Icon name={icon} className="size-[18px] text-text-muted" />}
        <span className="text-sm font-medium text-text">{title}</span>
        {badge != null && (
          <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-medium text-accent">
            {badge}
          </span>
        )}
        <Icon
          name="chevronDown"
          className={cn(
            "ml-auto size-4 text-text-muted transition-transform duration-300",
            open && "rotate-180"
          )}
        />
      </button>
      <div
        id={panelId}
        className="grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="px-4 pb-4 pt-1">{children}</div>
        </div>
      </div>
    </div>
  );
}
