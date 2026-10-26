"use client";

import { useCallback, useMemo, useState } from "react";
import { ASPECT_RATIOS } from "@/lib/constants";
import { uid } from "@/lib/utils";
import { appConfig } from "@/config/app.config";

const WS = appConfig.workspace.defaults;

/*
 * useWorkspace — state for the Pro Workspace (Part B).
 * The core idea is "lineage": every image is a node that remembers the
 * parent it was refined from. Professionals branch and compare instead of
 * scrolling a flat gallery. Renders run through a non-blocking queue so the
 * canvas never locks up while work is in flight.
 */

function dims(ratioId) {
  const r = ASPECT_RATIOS.find((x) => x.id === ratioId) || ASPECT_RATIOS[0];
  const base = 900;
  return r.w >= r.h
    ? { w: base, h: Math.round((base * r.h) / r.w) }
    : { w: Math.round((base * r.w) / r.h), h: base };
}

/** Curated Lorem Picsum photo by id, at the given ratio's dimensions. */
function idUrl(picId, ratioId) {
  const { w, h } = dims(ratioId);
  return `https://picsum.photos/id/${picId}/${w}/${h}`;
}

function node({ id, parentId, prompt, ratio = "4:3", model = "fomi-lumen", url, picId }) {
  return {
    id,
    parentId,
    prompt,
    ratio,
    model,
    picId,
    url, // an explicit curated image url (so upscale can double its size)
    favorite: false,
    createdAt: new Date().toISOString(),
  };
}

/** A small existing project so the workspace opens mid-flow, as briefed. */
function seedProject() {
  const n = {};
  n.root = node({ id: "root", parentId: null, picId: 16, url: idUrl(16, "4:3"),
    prompt: "Lone cabin by an alpine lake at dawn, volumetric mist, cinematic" });
  n.a1 = node({ id: "a1", parentId: "root", picId: 11, url: idUrl(11, "4:3"),
    prompt: "…dawn, volumetric mist, warmer light, reflection on the water" });
  n.a2 = node({ id: "a2", parentId: "root", picId: 29, url: idUrl(29, "4:3"),
    prompt: "…dawn, moodier blue hour, long exposure" });
  n.a1b = node({ id: "a1b", parentId: "a1", picId: 37, url: idUrl(37, "4:3"),
    prompt: "…warmer light, add a small rowboat at the shore" });
  n.a1c = node({ id: "a1c", parentId: "a1", picId: 66, url: idUrl(66, "4:3"),
    prompt: "…warmer light, tighter crop on the cabin" });
  n.a1b.favorite = true;
  return { nodes: n, rootIds: ["root"], selectedId: "a1b" };
}

export function useWorkspace() {
  const seed = useMemo(() => seedProject(), []);
  const [nodes, setNodes] = useState(seed.nodes);
  const [rootIds, setRootIds] = useState(seed.rootIds);
  const [selectedId, setSelectedId] = useState(seed.selectedId);
  const [jobs, setJobs] = useState([]); // active render jobs (non-blocking)
  const [compare, setCompare] = useState(false);

  const selected = nodes[selectedId] || null;
  const parent = selected?.parentId ? nodes[selected.parentId] : null;

  const childrenOf = useCallback(
    (id) => Object.values(nodes).filter((x) => x.parentId === id),
    [nodes]
  );

  /** Siblings of the selected node = the "current batch" shown as a filmstrip. */
  const batch = useMemo(() => {
    if (!selected) return [];
    return Object.values(nodes).filter((x) => x.parentId === selected.parentId);
  }, [nodes, selected]);

  const select = useCallback((id) => setSelectedId(id), []);

  const toggleFavorite = useCallback((id) => {
    setNodes((prev) => ({ ...prev, [id]: { ...prev[id], favorite: !prev[id].favorite } }));
  }, []);

  /**
   * Upscale: re-fetch the same image at 2× resolution and attach it as a
   * child node, so the result is the identical image, sharper — exactly
   * what an upscaler produces (not a different generation).
   */
  const upscale = useCallback(
    (id) => {
      setNodes((prev) => {
        const src = prev[id];
        if (!src) return prev;
        // Double the width/height in the existing image url → the same
        // picture at 2× resolution, exactly what an upscaler returns.
        const doubled = (src.url || "").replace(
          /\/(\d+)\/(\d+)(\?.*)?$/,
          (_m, w, h, q) => `/${+w * 2}/${+h * 2}${q || ""}`
        );
        const up = {
          ...src,
          id: uid("up"),
          parentId: id,
          upscaled: true,
          url: doubled,
          createdAt: new Date().toISOString(),
        };
        setSelectedId(up.id);
        return { ...prev, [up.id]: up };
      });
    },
    []
  );

  /**
   * Queue a render. Non-blocking: adds a job immediately, resolves it via
   * the mock API, then commits the new nodes as children of `parentId`.
   */
  const generate = useCallback(
    async ({ prompt, parentId = null, count = WS.branchSize, ratio = WS.ratio, model = WS.model }) => {
      const trimmed = (prompt || "").trim();
      if (!trimmed) return;

      const jobId = uid("job");
      setJobs((j) => [...j, { id: jobId, prompt: trimmed, parentId, count, ratio }]);

      try {
        const res = await fetch(appConfig.api.generations, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mode: "image", prompt: trimmed, count, model, ratio }),
        });
        const data = await res.json();
        const created = (data.items || []).map((item) =>
          node({ id: item.id, parentId, prompt: trimmed, ratio, model, url: item.url, picId: item.picId })
        );

        setNodes((prev) => {
          const next = { ...prev };
          created.forEach((c) => (next[c.id] = c));
          return next;
        });
        if (!parentId) setRootIds((r) => [...r, created[0]?.id].filter(Boolean));
        if (created[0]) setSelectedId(created[0].id);
      } catch {
        /* swallow — a real app would surface a toast */
      } finally {
        setJobs((j) => j.filter((x) => x.id !== jobId));
      }
    },
    []
  );

  return {
    nodes, rootIds, selected, parent, selectedId,
    jobs, compare, setCompare,
    childrenOf, batch,
    select, toggleFavorite, generate, upscale,
    isRendering: jobs.length > 0,
  };
}
