"use client";

import { MODELS } from "@/lib/constants";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import LineageTree from "./LineageTree";
import { timeAgo } from "@/lib/utils";
import { appConfig } from "@/config/app.config";

/**
 * Right pane: details & actions for the selected node, plus the lineage
 * tree. "Refine" seeds the command bar; "Variations" branches instantly.
 */
export default function Inspector({ ws, onRefine }) {
  const { selected, generate } = ws;
  const model = MODELS.find((m) => m.id === selected?.model) || MODELS[0];

  return (
    <div className="flex h-full flex-col">
      {/* details */}
      <div className="border-b border-[var(--border)] p-4">
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-subtle">
          Selected
        </h2>
        {selected ? (
          <>
            <p className="text-sm leading-relaxed text-text">{selected.prompt}</p>
            <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
              <Tag icon="layers">{model.name}</Tag>
              <Tag>{selected.ratio}</Tag>
              <Tag icon="clock">{timeAgo(selected.createdAt)}</Tag>
              {selected.upscaled && (
                <span className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-2 py-1 font-medium text-accent">
                  <Icon name="upscale" className="size-3" />
                  Upscaled 2×
                </span>
              )}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onRefine(selected)}
                className="w-full"
              >
                <Icon name="edit" className="size-4" />
                Refine
              </Button>
              <Button
                variant="soft"
                size="sm"
                className="w-full"
                onClick={() =>
                  generate({
                    prompt: selected.prompt,
                    parentId: selected.id,
                    count: appConfig.workspace.defaults.branchSize,
                    ratio: selected.ratio,
                    model: selected.model,
                  })
                }
              >
                <Icon name="variations" className="size-4" />
                Variations
              </Button>
            </div>
          </>
        ) : (
          <p className="text-sm text-text-muted">Nothing selected.</p>
        )}
      </div>

      {/* lineage */}
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex items-center gap-2 px-4 pt-4">
          <Icon name="variations" className="size-4 text-accent" />
          <h2 className="text-xs font-semibold uppercase tracking-wide text-text-subtle">
            Lineage
          </h2>
        </div>
        <div className="scrollbar-soft min-h-0 flex-1 overflow-y-auto p-3">
          <LineageTree ws={ws} />
        </div>
      </div>
    </div>
  );
}

function Tag({ icon, children }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-surface-sunken px-2 py-1 font-medium text-text-muted">
      {icon && <Icon name={icon} className="size-3" />}
      {children}
    </span>
  );
}
