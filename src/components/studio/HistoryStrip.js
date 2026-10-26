"use client";

import Image from "next/image";
import Link from "next/link";
import { BLUR_DATA_URL } from "@/lib/mockData";
import Icon from "@/components/ui/Icon";
import Skeleton from "@/components/ui/Skeleton";

/**
 * Horizontal reel of recent generations (the mockup's "History" strip).
 * Clicking a thumbnail re-loads its prompt into the composer.
 */
export default function HistoryStrip({ items, onSelect, loading }) {
  return (
    <section
      aria-label="Recent generations"
      className="grid grid-cols-[auto_minmax(0,1fr)] items-stretch gap-3"
    >
      {/* label card */}
      <div className="flex flex-col justify-center rounded-2xl border border-[var(--border)] bg-surface px-4 py-2">
        <span className="flex items-center gap-1.5 text-sm font-semibold text-text">
          <Icon name="clock" className="size-4 text-accent" />
          History
        </span>
        <Link
          href="/workspace"
          className="text-left text-xs text-text-muted transition-colors hover:text-accent cursor-pointer"
        >
          View all
        </Link>
      </div>

      {/* reel — minmax(0,1fr) track above guarantees this scrolls internally */}
      <div className="relative min-w-0">
        <ul className="no-scrollbar flex gap-2 overflow-x-auto scroll-smooth pb-1">
          {loading && items.length === 0
            ? Array.from({ length: 10 }).map((_, i) => (
                <li key={i} className="shrink-0">
                  <Skeleton className="size-[54px] rounded-xl sm:size-16" />
                </li>
              ))
            : items.map((item) => (
                <li key={item.id} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => onSelect?.(item)}
                    title={item.prompt}
                    className="group relative block size-[54px] overflow-hidden rounded-xl border border-[var(--border)] transition-all duration-200 hover:border-accent hover:shadow-[0_6px_16px_-8px_var(--ring)] focus-visible:border-accent sm:size-16 cursor-pointer"
                  >
                    <Image
                      src={item.poster || item.url}
                      alt={item.prompt}
                      fill
                      sizes="64px"
                      placeholder="blur"
                      blurDataURL={BLUR_DATA_URL}
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    {item.type === "video" && (
                      <span className="pointer-events-none absolute bottom-1 right-1 grid size-4 place-items-center rounded-full bg-black/55 text-white">
                        <Icon name="play" className="size-2.5" />
                      </span>
                    )}
                  </button>
                </li>
              ))}
        </ul>
        {/* right edge fade to hint more content */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[var(--canvas)] to-transparent"
        />
      </div>
    </section>
  );
}
