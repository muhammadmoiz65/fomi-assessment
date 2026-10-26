"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { BLUR_DATA_URL } from "@/lib/mockData";
import Icon from "@/components/ui/Icon";
import { ASPECT_RATIOS } from "@/lib/constants";
import { cn, downloadItem } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";

function ratioValue(id) {
  const r = ASPECT_RATIOS.find((x) => x.id === id) || ASPECT_RATIOS[0];
  return `${r.w} / ${r.h}`;
}

/**
 * A single generated result. Shows hover actions (favorite, variations,
 * download, expand). Video cards play a silent preview on hover.
 */
export default function ResultCard({
  item,
  index = 0,
  onToggleFavorite,
  onExpand,
  onVariations,
}) {
  const videoRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const isVideo = item.type === "video";
  const { toast } = useToast();

  const handleDownload = () => {
    downloadItem(item);
    toast("Download started", { icon: "download" });
  };

  const onEnter = () => {
    if (isVideo && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };
  const onLeave = () => {
    if (isVideo && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <figure
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-surface-sunken card-shadow animate-scale-in"
      style={{ aspectRatio: ratioValue(item.ratio), animationDelay: `${index * 50}ms` }}
    >
      {/* media */}
      {isVideo ? (
        <>
          <Image
            src={item.poster}
            alt={item.prompt}
            fill
            sizes="(max-width:768px) 50vw, 25vw"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            className="object-cover transition-opacity duration-300 group-hover:opacity-0"
            onLoad={() => setLoaded(true)}
          />
          <video
            ref={videoRef}
            src={item.url}
            poster={item.poster}
            muted
            loop
            playsInline
            preload="none"
            className="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
          <span className="pointer-events-none absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-black/55 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm">
            <Icon name="play" className="size-3" /> {item.duration}s
          </span>
        </>
      ) : (
        <Image
          src={item.url}
          alt={item.prompt}
          fill
          sizes="(max-width:768px) 50vw, 25vw"
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          className={cn(
            "object-cover transition-all duration-500 group-hover:scale-[1.04]",
            loaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setLoaded(true)}
        />
      )}

      {/* click anywhere on the card to open the preview (keyboard users
          use the Expand action button below, which stays focusable) */}
      <button
        type="button"
        tabIndex={-1}
        onClick={() => onExpand?.(item)}
        aria-label={`Open ${isVideo ? "video" : "image"} preview`}
        className="absolute inset-0 z-[1] cursor-pointer"
      />

      {/* favorite — always visible, filled when active */}
      <button
        type="button"
        onClick={() => onToggleFavorite?.(item.id)}
        aria-pressed={item.favorite}
        aria-label={item.favorite ? "Remove from favorites" : "Add to favorites"}
        className={cn(
          "absolute right-2 top-2 z-10 grid size-8 place-items-center rounded-full backdrop-blur-sm transition-all duration-200 active:scale-90 cursor-pointer",
          item.favorite
            ? "bg-white/90 text-accent"
            : "bg-black/35 text-white opacity-0 group-hover:opacity-100 hover:bg-black/55"
        )}
      >
        <Icon name="heart" className="size-4" strokeWidth={item.favorite ? 0 : 1.8}
          style={{ fill: item.favorite ? "var(--accent)" : "none" }} />
      </button>

      {/* hover gradient + action bar */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <figcaption className="absolute inset-x-0 bottom-0 z-10 flex translate-y-2 items-center gap-1 p-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <Action icon="expand" label="Expand" onClick={() => onExpand?.(item)} />
        <Action icon="variations" label="Create variations" onClick={() => onVariations?.(item)} />
        <Action icon="download" label="Download" onClick={handleDownload} className="ml-auto" />
      </figcaption>
    </figure>
  );
}

function Action({ icon, label, onClick, className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        "pointer-events-auto grid size-8 place-items-center rounded-lg bg-black/40 text-white backdrop-blur-sm transition-all duration-200 hover:bg-black/60 active:scale-90 cursor-pointer",
        className
      )}
    >
      <Icon name={icon} className="size-4" />
    </button>
  );
}
