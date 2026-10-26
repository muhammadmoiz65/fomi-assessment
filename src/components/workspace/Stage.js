"use client";

import Image from "next/image";
import Link from "next/link";
import { BLUR_DATA_URL } from "@/lib/mockData";
import Icon from "@/components/ui/Icon";
import IconButton from "@/components/ui/IconButton";
import { cn } from "@/lib/utils";

/** Walk from a node up to its root to show the lineage breadcrumb. */
function pathTo(nodes, id) {
  const path = [];
  let cur = nodes[id];
  while (cur) {
    path.unshift(cur);
    cur = cur.parentId ? nodes[cur.parentId] : null;
  }
  return path;
}

function Frame({ node, label }) {
  // min-h-0 + the stretched parent give this a definite height, so the
  // image is bounded by the available canvas space (max-h-full) and can
  // never overflow into the header or filmstrip.
  return (
    <div className="relative flex min-h-0 min-w-0 flex-1 items-center justify-center">
      {label && (
        <span className="absolute left-3 top-3 z-10 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
          {label}
        </span>
      )}
      <Image
        key={node.id}
        src={node.url}
        alt={node.prompt}
        width={900}
        height={900}
        placeholder="blur"
        blurDataURL={BLUR_DATA_URL}
        className="h-auto max-h-full w-auto max-w-full rounded-2xl object-contain shadow-[0_24px_60px_-24px_rgba(0,0,0,0.55)] animate-scale-in"
        priority
      />
    </div>
  );
}

/**
 * Center stage: the focused generation (optionally compared against its
 * parent), a lineage breadcrumb, and the current batch as a filmstrip.
 */
export default function Stage({ ws, onOpenLineage }) {
  const { nodes, selected, parent, batch, jobs, compare, setCompare, select, toggleFavorite } = ws;

  if (!selected) return null;
  const crumbs = pathTo(nodes, selected.id);

  return (
    <section className="flex min-h-0 min-w-0 flex-1 flex-col bg-surface-sunken">
      {/* stage header */}
      <div className="flex items-center gap-2 border-b border-[var(--border)] px-3 py-2.5 sm:px-4">
        {/* mobile back-to-studio (tool rail is hidden below md) */}
        <Link
          href="/"
          aria-label="Back to studio"
          title="Back to studio"
          className="-ml-1 grid size-8 shrink-0 place-items-center rounded-lg text-text-muted transition-colors hover:bg-surface hover:text-text md:hidden"
        >
          <Icon name="home" className="size-[18px]" />
        </Link>

        {/* lineage breadcrumb */}
        <nav aria-label="Lineage path" className="flex min-w-0 items-center gap-1 text-xs">
          {crumbs.map((c, i) => (
            <span key={c.id} className="flex min-w-0 items-center gap-1">
              {i > 0 && <Icon name="chevronRight" className="size-3 shrink-0 text-text-subtle" />}
              <button
                type="button"
                onClick={() => select(c.id)}
                className={cn(
                  "shrink-0 rounded-md px-1.5 py-0.5 transition-colors cursor-pointer",
                  c.id === selected.id
                    ? "bg-accent-soft font-medium text-accent"
                    : "text-text-muted hover:text-text"
                )}
              >
                {i === 0 ? "Root" : `v${i}`}
              </button>
            </span>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          {parent && (
            <button
              type="button"
              onClick={() => setCompare((v) => !v)}
              aria-pressed={compare}
              className={cn(
                "hidden items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer sm:inline-flex",
                compare ? "bg-accent text-[var(--accent-contrast)]" : "text-text-muted hover:bg-surface hover:text-text"
              )}
            >
              <Icon name="compare" className="size-4" />
              Compare
            </button>
          )}
          <IconButton
            icon="heart"
            label={selected.favorite ? "Unfavorite" : "Favorite"}
            variant="ghost"
            active={selected.favorite}
            onClick={() => toggleFavorite(selected.id)}
          />
          {/* mobile: open lineage/inspector slide-over */}
          <button
            type="button"
            onClick={onOpenLineage}
            className="inline-flex items-center gap-1.5 rounded-lg bg-surface px-2.5 py-1.5 text-xs font-medium text-text transition-colors hover:bg-surface-soft cursor-pointer lg:hidden"
          >
            <Icon name="variations" className="size-4" />
            Lineage
          </button>
        </div>
      </div>

      {/* canvas — items-stretch gives frames a definite height so images
          scale to fit the available space instead of bleeding into the
          header/filmstrip; overflow-hidden is a final safety net. */}
      <div className="flex min-h-0 flex-1 items-stretch justify-center gap-4 overflow-hidden p-4 sm:p-6">
        {compare && parent ? (
          <div className="flex min-h-0 w-full items-stretch justify-center gap-3 sm:gap-5">
            <Frame node={parent} label={`Parent · v${crumbs.length - 2 >= 0 ? crumbs.length - 2 : 0}`} />
            <div className="w-px shrink-0 bg-[var(--border)]" />
            <Frame node={selected} label={`Current · v${crumbs.length - 1}`} />
          </div>
        ) : (
          <Frame node={selected} />
        )}
      </div>

      {/* filmstrip: current batch + in-flight jobs */}
      <div className="border-t border-[var(--border)] px-3 py-3 sm:px-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-medium text-text-muted">
            Batch · {batch.length} {batch.length === 1 ? "variation" : "variations"}
          </span>
          {jobs.length > 0 && (
            <span className="flex items-center gap-1.5 text-xs text-accent">
              <span className="size-1.5 animate-pulse rounded-full bg-accent" />
              {jobs.length} rendering
            </span>
          )}
        </div>
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
          {batch.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => select(b.id)}
              aria-current={b.id === selected.id}
              title={b.prompt}
              className={cn(
                "relative size-16 shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-200 cursor-pointer sm:size-20",
                b.id === selected.id
                  ? "border-accent shadow-[0_6px_16px_-8px_var(--ring)]"
                  : "border-transparent opacity-70 hover:opacity-100"
              )}
            >
              <Image src={b.url} alt={b.prompt} fill sizes="80px" className="object-cover" />
              {b.favorite && (
                <span className="absolute right-1 top-1 grid size-4 place-items-center rounded-full bg-white/90 text-accent">
                  <Icon name="heart" className="size-2.5" style={{ fill: "var(--accent)" }} strokeWidth={0} />
                </span>
              )}
            </button>
          ))}
          {/* rendering placeholders */}
          {jobs.map((j) =>
            Array.from({ length: j.count }).map((_, i) => (
              <div key={`${j.id}-${i}`} className="skeleton size-16 shrink-0 rounded-xl sm:size-20" />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
