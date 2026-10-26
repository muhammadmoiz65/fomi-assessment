"use client";

import { useEffect, useState } from "react";
import { useWorkspace } from "@/hooks/useWorkspace";
import ToolRail from "./ToolRail";
import Stage from "./Stage";
import Inspector from "./Inspector";
import CommandBar from "./CommandBar";
import IconButton from "@/components/ui/IconButton";
import Icon from "@/components/ui/Icon";
import { appConfig } from "@/config/app.config";
import { useToast } from "@/components/ui/Toast";

const WS = appConfig.workspace.defaults;

/**
 * Part B — "Fomi Pro": an image-generation workspace built around
 * lineage (branching iteration) and a non-blocking render queue.
 * Three panes on desktop; the inspector collapses into a slide-over on
 * smaller screens so the canvas always stays the hero.
 */
export default function WorkspaceShell() {
  const ws = useWorkspace();

  // command-bar state (shared so the Inspector can seed a refine)
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState(WS.model);
  const [ratio, setRatio] = useState(WS.ratio);
  const [branchFrom, setBranchFrom] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [activeTool, setActiveTool] = useState("Generate");
  const { toast } = useToast();

  // Close the mobile lineage slide-over on Escape (it already closes on
  // backdrop click) so every overlay behaves consistently.
  useEffect(() => {
    if (!sheetOpen) return;
    const onKey = (e) => e.key === "Escape" && setSheetOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [sheetOpen]);

  // Tool rail actions — every tool performs a real operation.
  const handleTool = (label) => {
    setActiveTool(label);
    if (label === "Generate") {
      document.getElementById("cmd")?.focus();
    } else if (label === "Variations") {
      if (ws.selected) {
        ws.generate({
          prompt: ws.selected.prompt,
          parentId: ws.selected.id,
          count: WS.branchSize,
          ratio: ws.selected.ratio,
          model: ws.selected.model,
        });
        toast("Creating variations…", { icon: "variations" });
      }
    } else if (label === "Upscale") {
      if (ws.selected) {
        ws.upscale(ws.selected.id);
        toast("Upscaled to 2× resolution", { icon: "upscale" });
      }
    } else if (label === "Edit") {
      if (ws.selected) {
        handleRefine(ws.selected);
        toast("Describe your edit, then Generate", { icon: "edit" });
      }
    }
  };

  const handleGenerate = () => {
    ws.generate({
      prompt,
      parentId: branchFrom ? ws.selectedId : null,
      count: WS.branchSize,
      ratio,
      model,
    });
    setPrompt("");
  };

  const handleRefine = (node) => {
    setPrompt(node.prompt);
    setBranchFrom(true);
    setModel(node.model);
    setRatio(node.ratio);
    setSheetOpen(false);
    document.getElementById("cmd")?.focus();
  };

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-canvas">
      <div className="flex min-h-0 flex-1">
        <ToolRail
          activeTool={activeTool}
          compare={ws.compare}
          onToggleCompare={() => ws.setCompare((v) => !v)}
          onTool={handleTool}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <Stage ws={ws} onOpenLineage={() => setSheetOpen(true)} />
          <CommandBar
            prompt={prompt}
            setPrompt={setPrompt}
            model={model}
            setModel={setModel}
            ratio={ratio}
            setRatio={setRatio}
            branchFrom={branchFrom}
            setBranchFrom={setBranchFrom}
            onGenerate={handleGenerate}
            isRendering={ws.isRendering}
          />
        </div>

        {/* right pane (laptop & up) */}
        <aside className="hidden w-80 shrink-0 border-l border-[var(--border)] bg-surface lg:flex lg:flex-col">
          <Inspector ws={ws} onRefine={handleRefine} />
        </aside>
      </div>

      {/* right pane as slide-over (tablet / mobile) */}
      {sheetOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden" role="dialog" aria-modal="true" aria-label="Lineage">
          <div className="flex-1 bg-black/40 animate-fade-up" style={{ animationDuration: "0.2s" }} onClick={() => setSheetOpen(false)} />
          <aside className="flex w-[min(22rem,88vw)] flex-col bg-surface shadow-2xl" style={{ animation: "fomi-fade-up 0.25s both" }}>
            <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
              <span className="flex items-center gap-2 text-sm font-semibold text-text">
                <Icon name="variations" className="size-4 text-accent" /> Lineage
              </span>
              <IconButton icon="close" label="Close" variant="ghost" onClick={() => setSheetOpen(false)} />
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">
              <Inspector ws={ws} onRefine={handleRefine} />
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
