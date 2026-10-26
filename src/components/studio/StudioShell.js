"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useStudio } from "@/hooks/useStudio";
import HistoryStrip from "./HistoryStrip";
import PromptComposer from "./PromptComposer";
import ResultsGallery from "./ResultsGallery";

/**
 * Part A — the AI content generation workspace from the mockup.
 * Left: prompt composer & controls. Right: history reel + results.
 * All state is owned by useStudio; this shell is pure composition.
 */
export default function StudioShell() {
  const studio = useStudio();
  const searchParams = useSearchParams();

  // Honour /?mode=video deep-links from the top nav.
  useEffect(() => {
    const mode = searchParams.get("mode");
    if (mode === "video" || mode === "image") studio.setMode(mode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const onHistorySelect = (item) => {
    studio.applyPrompt(item.prompt);
    if (item.type === "video" || item.type === "image") studio.setMode(item.type);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="mx-auto w-full max-w-[1600px] overflow-x-clip px-4 pb-16 pt-4 sm:px-6">
      {/* history reel */}
      <HistoryStrip
        items={studio.history}
        onSelect={onHistorySelect}
        loading={studio.history.length === 0}
      />

      {/* workspace — two columns from tablet up, stacked on phones */}
      <div className="mt-4 flex flex-col gap-5 md:flex-row md:gap-5 lg:gap-6">
        {/* controls */}
        <aside className="md:sticky md:top-[76px] md:h-fit md:w-[300px] md:shrink-0 lg:w-[340px]">
          <PromptComposer studio={studio} />
        </aside>

        {/* results */}
        <main className="min-w-0 flex-1">
          <ResultsGallery studio={studio} />
        </main>
      </div>
    </div>
  );
}
