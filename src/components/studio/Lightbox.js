"use client";

import { useEffect } from "react";
import Image from "next/image";
import { BLUR_DATA_URL } from "@/lib/mockData";
import { MODELS } from "@/lib/constants";
import Icon from "@/components/ui/Icon";
import IconButton from "@/components/ui/IconButton";
import Button from "@/components/ui/Button";
import { timeAgo, downloadItem } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";

/** Full-screen viewer for a single generation. Escape / backdrop to close. */
export default function Lightbox({ item, onClose, onToggleFavorite, onVariations }) {
  const { toast } = useToast();
  useEffect(() => {
    if (!item) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [item, onClose]);

  if (!item) return null;
  const model = MODELS.find((m) => m.id === item.model) || MODELS[0];
  const isVideo = item.type === "video";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Generation preview"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fade-up"
      style={{ animationDuration: "0.2s" }}
      onClick={onClose}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-surface card-shadow-lg md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* media — sized to the image on mobile (shrink-0, no overflow),
            fills the left pane on desktop */}
        <div className="relative flex shrink-0 items-center justify-center overflow-hidden bg-surface-sunken md:min-h-0 md:flex-1">
          {isVideo ? (
            <video
              src={item.url}
              poster={item.poster}
              controls
              autoPlay
              muted
              loop
              playsInline
              className="mx-auto max-h-[44vh] w-full object-contain md:max-h-[92vh]"
            />
          ) : (
            <Image
              src={item.url}
              alt={item.prompt}
              width={item.width}
              height={item.height}
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
              className="mx-auto max-h-[44vh] w-auto max-w-full object-contain md:max-h-[92vh]"
            />
          )}
          <IconButton
            icon="close"
            label="Close preview"
            variant="glass"
            onClick={onClose}
            className="absolute right-3 top-3 md:hidden"
          />
        </div>

        {/* details — scroll within the modal on mobile */}
        <aside className="flex min-h-0 w-full flex-1 flex-col gap-4 overflow-y-auto p-5 md:w-80 md:flex-none md:shrink-0">
          <div className="hidden justify-end md:flex">
            <IconButton icon="close" label="Close preview" variant="ghost" onClick={onClose} />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-text">Prompt</h3>
            <p className="mt-1 text-sm leading-relaxed text-text-muted">{item.prompt}</p>
          </div>

          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
            <Meta label="Model" value={model.name} />
            <Meta label="Aspect" value={item.ratio} />
            <Meta label="Type" value={item.type} />
            <Meta label="Created" value={timeAgo(item.createdAt)} />
            {item.seed != null && <Meta label="Seed" value={item.seed} mono />}
            {item.duration && <Meta label="Duration" value={`${item.duration}s`} />}
          </dl>

          <div className="mt-auto flex flex-col gap-2 pt-2">
            <div className="flex gap-2">
              <Button variant="secondary" size="md" className="flex-1" onClick={() => onToggleFavorite?.(item.id)}>
                <Icon name="heart" className="size-4" style={{ fill: item.favorite ? "var(--accent)" : "none" }} />
                {item.favorite ? "Saved" : "Save"}
              </Button>
              <Button
                variant="secondary"
                size="md"
                className="flex-1"
                onClick={() => {
                  downloadItem(item);
                  toast("Download started", { icon: "download" });
                }}
              >
                <Icon name="download" className="size-4" />
                Download
              </Button>
            </div>
            <Button size="md" className="w-full" onClick={() => onVariations?.(item)}>
              <Icon name="variations" className="size-4" />
              Create variations
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Meta({ label, value, mono }) {
  return (
    <div>
      <dt className="text-text-subtle">{label}</dt>
      <dd className={`mt-0.5 font-medium capitalize text-text ${mono ? "font-mono" : ""}`}>
        {value}
      </dd>
    </div>
  );
}
