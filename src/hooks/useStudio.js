"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ADVANCED_DEFAULTS } from "@/lib/constants";
import { appConfig } from "@/config/app.config";
import { uid } from "@/lib/utils";

const { defaults } = appConfig.generation;

/**
 * useStudio — the state machine behind the generation workspace.
 * Owns all generation parameters, talks to the mock API, and exposes a
 * small, intention-revealing surface so UI components stay presentational.
 *
 * Results are grouped into *batches* — one per generate — so each set of
 * outputs stays attached to the prompt that produced it. New batches are
 * prepended; older ones remain below as a scrollable session history.
 */
export function useStudio() {
  const [mode, setMode] = useState(defaults.mode); // "image" | "video"
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState(defaults.model);
  const [style, setStyle] = useState(defaults.style);
  const [ratio, setRatio] = useState(defaults.ratio);
  const [count, setCount] = useState(defaults.count);
  const [advanced, setAdvanced] = useState(ADVANCED_DEFAULTS);

  const [batches, setBatches] = useState([]); // newest first; each has { id, prompt, …, items }
  const [history, setHistory] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | error
  const [error, setError] = useState(null);
  const [pending, setPending] = useState(null); // the in-flight batch's header + settings

  // Guard against overlapping requests / state updates after unmount.
  const inFlight = useRef(false);

  // Load the returning user's recent work on mount.
  useEffect(() => {
    let alive = true;
    fetch(appConfig.api.history)
      .then((r) => r.json())
      .then((data) => alive && setHistory(data.items || []))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  // Core generation. Takes explicit params so it works both from the
  // composer (current settings) and from "Create variations" (an item's).
  const runGeneration = useCallback(async (opts) => {
    const trimmed = (opts.prompt || "").trim();
    if (!trimmed || inFlight.current) return;
    const { mode, model, style, ratio, count } = opts;

    inFlight.current = true;
    setStatus("loading");
    setError(null);
    setPending({ prompt: trimmed, model, style, ratio, mode, count });

    try {
      const res = await fetch(appConfig.api.generations, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, prompt: trimmed, count, model, style, ratio }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Generation failed. Please try again.");
      }
      const data = await res.json();
      const batch = {
        id: uid("batch"),
        prompt: trimmed,
        model, style, ratio, mode, count,
        createdAt: new Date().toISOString(),
        items: data.items,
      };
      setBatches((prev) => [batch, ...prev]);
      setHistory((prev) => [...data.items, ...prev].slice(0, 40));
      setStatus("idle");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    } finally {
      setPending(null);
      inFlight.current = false;
    }
  }, []);

  const generate = useCallback(
    () => runGeneration({ prompt, mode, model, style, ratio, count }),
    [runGeneration, prompt, mode, model, style, ratio, count]
  );

  // Re-run from an existing result's prompt & settings to explore variations.
  const createVariations = useCallback(
    (item) => {
      // reflect the source in the composer for context
      setPrompt(item.prompt);
      setMode(item.type);
      setRatio(item.ratio);
      if (item.model) setModel(item.model);
      runGeneration({
        prompt: item.prompt,
        mode: item.type,
        model: item.model || model,
        style: item.style || "none",
        ratio: item.ratio,
        count,
      });
    },
    [runGeneration, model, count]
  );

  const toggleFavorite = useCallback((id) => {
    setBatches((prev) =>
      prev.map((b) => ({
        ...b,
        items: b.items.map((it) =>
          it.id === id ? { ...it, favorite: !it.favorite } : it
        ),
      }))
    );
  }, []);

  const removeResult = useCallback((id) => {
    setBatches((prev) =>
      prev
        .map((b) => ({ ...b, items: b.items.filter((it) => it.id !== id) }))
        .filter((b) => b.items.length > 0)
    );
  }, []);

  const applyPrompt = useCallback((text) => {
    setPrompt(text);
  }, []);

  const totalResults = batches.reduce((n, b) => n + b.items.length, 0);

  return {
    // params
    mode, setMode,
    prompt, setPrompt,
    model, setModel,
    style, setStyle,
    ratio, setRatio,
    count, setCount,
    advanced, setAdvanced,
    // data
    batches, history, pending, totalResults,
    status, error,
    isGenerating: status === "loading",
    // actions
    generate, createVariations, toggleFavorite, removeResult, applyPrompt,
  };
}
