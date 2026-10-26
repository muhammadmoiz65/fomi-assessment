"use client";

import Link from "next/link";
import Logo from "@/components/ui/Logo";
import Icon from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/layout/ThemeToggle";

// Every tool here maps to a real action — nothing decorative.
const TOOLS = [
  { icon: "image", label: "Generate" },
  { icon: "variations", label: "Variations" },
  { icon: "upscale", label: "Upscale" },
  { icon: "edit", label: "Edit" },
];

/** Slim vertical tool rail for the pro cockpit (desktop only). */
export default function ToolRail({ activeTool = "Generate", compare, onToggleCompare, onTool }) {
  return (
    <aside className="hidden w-16 shrink-0 flex-col items-center gap-2 border-r border-[var(--border)] bg-surface py-3 md:flex">
      <Link href="/" aria-label="Back to studio" className="mb-2">
        <Logo />
      </Link>

      <div className="flex flex-col gap-1">
        {TOOLS.map((t) => (
          <button
            key={t.label}
            type="button"
            title={t.label}
            aria-label={t.label}
            aria-pressed={t.label === activeTool}
            onClick={() => onTool?.(t.label)}
            className={cn(
              "grid size-11 place-items-center rounded-xl transition-all duration-200 cursor-pointer active:scale-90",
              t.label === activeTool
                ? "bg-accent-soft text-accent"
                : "text-text-muted hover:bg-surface-soft hover:text-text"
            )}
          >
            <Icon name={t.icon} className="size-5" />
          </button>
        ))}
      </div>

      <div className="my-1 h-px w-8 bg-[var(--border)]" />

      <button
        type="button"
        onClick={onToggleCompare}
        title="Compare with parent"
        aria-label="Compare with parent"
        aria-pressed={compare}
        className={cn(
          "grid size-11 place-items-center rounded-xl transition-all duration-200 cursor-pointer active:scale-90",
          compare ? "bg-accent text-[var(--accent-contrast)]" : "text-text-muted hover:bg-surface-soft hover:text-text"
        )}
      >
        <Icon name="compare" className="size-5" />
      </button>

      <div className="mt-auto flex flex-col items-center gap-1">
        <ThemeToggle />
        <Link
          href="/"
          title="Exit to studio"
          aria-label="Exit to studio"
          className="grid size-9 place-items-center rounded-xl text-text-muted transition-colors hover:bg-surface-soft hover:text-text"
        >
          <Icon name="home" className="size-[18px]" />
        </Link>
      </div>
    </aside>
  );
}
