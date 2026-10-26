"use client";

import { MODELS, ASPECT_RATIOS } from "@/lib/constants";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import Dropdown, { DropdownItem } from "@/components/ui/Dropdown";
import { cn } from "@/lib/utils";

/**
 * Persistent bottom command bar. "Branch from selected" expresses the
 * core model: a render either forks the current image or starts fresh.
 */
export default function CommandBar({
  prompt, setPrompt,
  model, setModel,
  ratio, setRatio,
  branchFrom, setBranchFrom,
  onGenerate, isRendering,
}) {
  const activeModel = MODELS.find((m) => m.id === model) || MODELS[0];
  const canGenerate = prompt.trim().length > 0;

  const onKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && canGenerate) {
      e.preventDefault();
      onGenerate();
    }
  };

  return (
    <div className="shrink-0 border-t border-[var(--border)] bg-surface/80 p-3 backdrop-blur-md sm:p-4">
      <div className="mx-auto flex max-w-4xl flex-col gap-2 rounded-2xl border border-[var(--border)] bg-surface p-2 card-shadow">
        <div className="flex items-end gap-2">
          <button
            type="button"
            onClick={() => setBranchFrom((v) => !v)}
            aria-pressed={branchFrom}
            title={branchFrom ? "Forking the selected image" : "Starting a new root"}
            className={cn(
              "mb-1 hidden shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium transition-colors cursor-pointer sm:inline-flex",
              branchFrom
                ? "bg-accent-soft text-accent"
                : "bg-surface-sunken text-text-muted hover:text-text"
            )}
          >
            <Icon name={branchFrom ? "variations" : "plus"} className="size-4" />
            {branchFrom ? "Branch" : "New"}
          </button>

          <label htmlFor="cmd" className="sr-only">
            Describe your next render
          </label>
          <textarea
            id="cmd"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={onKeyDown}
            rows={1}
            placeholder={branchFrom ? "Refine the selected image…" : "Describe a new image…"}
            className="max-h-32 min-h-[40px] flex-1 resize-none self-center bg-transparent px-1 py-2 text-sm text-text placeholder:text-text-subtle focus:outline-none"
          />

          <Button
            size="md"
            onClick={onGenerate}
            loading={isRendering}
            disabled={!canGenerate}
            className="mb-0.5 shrink-0"
          >
            {!isRendering && <Icon name="sparkle" className="size-4" />}
            {isRendering ? "Queued" : "Generate"}
          </Button>
        </div>

        {/* quick settings */}
        <div className="flex items-center gap-2 border-t border-[var(--border)] px-1 pt-2">
          <Dropdown
            direction="up"
            renderTrigger={({ open }) => (
              <Chip icon="layers" label={activeModel.name} open={open} />
            )}
          >
            {MODELS.map((m) => (
              <DropdownItem key={m.id} selected={m.id === model} onSelect={() => setModel(m.id)}>
                {m.name}
              </DropdownItem>
            ))}
          </Dropdown>

          <Dropdown
            direction="up"
            renderTrigger={({ open }) => <Chip icon="grid" label={ratio} open={open} />}
          >
            {ASPECT_RATIOS.map((r) => (
              <DropdownItem key={r.id} selected={r.id === ratio} onSelect={() => setRatio(r.id)}>
                {r.label} · {r.id}
              </DropdownItem>
            ))}
          </Dropdown>

          <span className="ml-auto hidden items-center gap-1 text-[11px] text-text-subtle sm:flex">
            <kbd className="rounded border border-[var(--border)] bg-surface-sunken px-1.5 py-0.5 font-mono">⌘</kbd>
            <kbd className="rounded border border-[var(--border)] bg-surface-sunken px-1.5 py-0.5 font-mono">↵</kbd>
            to generate
          </span>
        </div>
      </div>
    </div>
  );
}

function Chip({ icon, label, open }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors",
        open ? "border-accent text-accent" : "border-[var(--border)] text-text-muted hover:text-text"
      )}
    >
      <Icon name={icon} className="size-3.5" />
      {label}
      <Icon name="chevronDown" className={cn("size-3 transition-transform", open && "rotate-180")} />
    </span>
  );
}
