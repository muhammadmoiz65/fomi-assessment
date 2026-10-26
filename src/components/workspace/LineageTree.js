"use client";

import Image from "next/image";
import Icon from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/**
 * The lineage view — the workspace's signature feature. Renders the
 * project as a branching tree so a professional can see exactly how each
 * image was derived and jump to any point to fork a new direction.
 */
export default function LineageTree({ ws }) {
  const { rootIds } = ws;
  return (
    <div className="flex flex-col gap-1">
      {rootIds.map((id) => (
        <TreeNode key={id} id={id} ws={ws} depth={0} label="Root" />
      ))}
    </div>
  );
}

function TreeNode({ id, ws, depth, label }) {
  const { nodes, selectedId, select, childrenOf } = ws;
  const n = nodes[id];
  if (!n) return null;
  const kids = childrenOf(id);
  const active = id === selectedId;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => select(id)}
        aria-current={active}
        className={cn(
          "flex w-full items-center gap-2.5 rounded-xl p-1.5 pr-2.5 text-left transition-all duration-200 cursor-pointer",
          active ? "bg-accent-soft" : "hover:bg-surface-soft"
        )}
        style={{ marginLeft: depth * 14 }}
      >
        <span className="relative size-9 shrink-0 overflow-hidden rounded-lg">
          <Image src={n.url} alt={n.prompt} fill sizes="36px" className="object-cover" />
        </span>
        <span className="min-w-0 flex-1">
          <span className={cn("block truncate text-xs font-medium", active ? "text-accent" : "text-text")}>
            {label || `Variation`}
          </span>
          <span className="block truncate text-[11px] text-text-subtle">{n.prompt}</span>
        </span>
        {n.favorite && (
          <Icon name="heart" className="size-3.5 shrink-0 text-accent" style={{ fill: "var(--accent)" }} strokeWidth={0} />
        )}
      </button>

      {kids.length > 0 && (
        <div className="relative mt-1 flex flex-col gap-1 border-l border-[var(--border)]" style={{ marginLeft: depth * 14 + 18 }}>
          {kids.map((k, i) => (
            <TreeNode key={k.id} id={k.id} ws={ws} depth={0} label={`v${depth + 1}.${i + 1}`} />
          ))}
        </div>
      )}
    </div>
  );
}
