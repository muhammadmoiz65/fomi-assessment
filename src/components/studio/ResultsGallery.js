"use client";

import { useState } from "react";
import { ASPECT_RATIOS } from "@/lib/constants";
import Icon from "@/components/ui/Icon";
import ActivePromptCard from "./ActivePromptCard";
import ResultCard from "./ResultCard";
import EmptyState from "./EmptyState";
import Lightbox from "./Lightbox";

function ratioValue(id) {
  const r = ASPECT_RATIOS.find((x) => x.id === id) || ASPECT_RATIOS[0];
  return `${r.w} / ${r.h}`;
}

const GRID = "grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4";

/**
 * The results surface. Each generation is shown as its own batch —
 * prompt header + grid — newest first, so outputs always stay tied to the
 * prompt that made them. Includes the in-progress batch, empty state and
 * the lightbox.
 */
export default function ResultsGallery({ studio }) {
  const {
    batches, isGenerating, count, ratio, mode, pending, totalResults,
    toggleFavorite, applyPrompt, createVariations,
  } = studio;
  const [preview, setPreview] = useState(null);

  // Variations start a fresh batch; close the lightbox and scroll up so the
  // user sees it rendering at the top.
  const handleVariations = (item) => {
    setPreview(null);
    createVariations(item);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hasContent = batches.length > 0 || isGenerating;
  if (!hasContent) return <EmptyState onPick={applyPrompt} />;

  // Flat lookup so the lightbox stays in sync with favorite toggles.
  const allItems = batches.flatMap((b) => b.items);
  const livePreview = preview
    ? allItems.find((i) => i.id === preview.id) || preview
    : null;

  const unit = mode === "video" ? "clip" : "image";

  return (
    <section aria-label="Generated results" className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-text">
          <Icon name="gallery" className="size-4 text-accent" />
          {totalResults > 0
            ? `${totalResults} result${totalResults === 1 ? "" : "s"}`
            : "Generating…"}
        </h2>
      </div>

      {/* in-progress batch */}
      {isGenerating && pending && (
        <div className="flex flex-col gap-3 animate-fade-up">
          <ActivePromptCard active={pending} />
          <div className="flex items-center gap-1.5 text-xs text-accent">
            <span className="size-1.5 animate-pulse rounded-full bg-accent" />
            Rendering {count} {count === 1 ? unit : `${unit}s`}…
          </div>
          <div className={GRID}>
            {Array.from({ length: count }).map((_, i) => (
              <div
                key={`sk-${i}`}
                className="skeleton rounded-2xl"
                style={{ aspectRatio: ratioValue(ratio), animationDelay: `${i * 80}ms` }}
              />
            ))}
          </div>
        </div>
      )}

      {/* completed batches, newest first */}
      {batches.map((batch) => (
        <div key={batch.id} className="flex flex-col gap-3 animate-fade-up">
          <ActivePromptCard active={batch} />
          <div className={GRID}>
            {batch.items.map((item, i) => (
              <ResultCard
                key={item.id}
                item={item}
                index={i}
                onToggleFavorite={toggleFavorite}
                onExpand={setPreview}
                onVariations={handleVariations}
              />
            ))}
          </div>
        </div>
      ))}

      <Lightbox
        item={livePreview}
        onClose={() => setPreview(null)}
        onToggleFavorite={toggleFavorite}
        onVariations={handleVariations}
      />
    </section>
  );
}
