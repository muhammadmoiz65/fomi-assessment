"use client";

import { MODELS, IMAGE_COUNTS, PROMPT_SUGGESTIONS } from "@/lib/constants";
import { cn, seededRandom } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import Segmented from "@/components/ui/Segmented";
import Dropdown, { DropdownItem } from "@/components/ui/Dropdown";
import Collapsible from "@/components/ui/Collapsible";
import Slider from "@/components/ui/Slider";
import StylePicker from "./StylePicker";
import AspectRatioPicker from "./AspectRatioPicker";
import { STYLES } from "@/lib/constants";
import { appConfig } from "@/config/app.config";

const MODE_OPTIONS = [
  { value: "image", label: "Image", icon: "image" },
  { value: "video", label: "Video", icon: "video" },
];

export default function PromptComposer({ studio }) {
  const {
    mode, setMode,
    prompt, setPrompt,
    model, setModel,
    style, setStyle,
    ratio, setRatio,
    count, setCount,
    advanced, setAdvanced,
    generate, isGenerating, error,
  } = studio;

  const activeModel = MODELS.find((m) => m.id === model) || MODELS[0];
  const activeStyle = STYLES.find((s) => s.id === style);
  const canGenerate = prompt.trim().length > 0 && !isGenerating;

  // Copy adapts to the active mode (images vs. video clips).
  const unit = mode === "video" ? "clip" : "image";
  const unitLabel = mode === "video" ? "Clips" : "Images";

  const onKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && canGenerate) {
      e.preventDefault();
      generate();
    }
  };

  const randomizeSeed = () =>
    setAdvanced((a) => ({ ...a, seed: String(Math.floor(seededRandom(String(Date.now())) * 1_000_000)) }));

  return (
    // Cohesive blush control panel — the left "studio" sidebar from the
    // mockup: all controls grouped on one soft pink surface.
    <div className="flex flex-col gap-3 rounded-[1.75rem] border border-[var(--border)] bg-surface-soft p-3 card-shadow">
      {/* mode toggle */}
      <Segmented
        name="Generation mode"
        options={MODE_OPTIONS}
        value={mode}
        onChange={setMode}
        className="w-full"
      />

      {/* prompt card */}
      <div className="rounded-2xl border border-[var(--border)] bg-surface p-3 card-shadow">
        <label htmlFor="prompt" className="sr-only">
          Describe what you want to create
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={onKeyDown}
          rows={4}
          maxLength={appConfig.limits.promptMaxLength}
          placeholder={appConfig.prompts.placeholder}
          className="w-full resize-none bg-transparent text-sm leading-relaxed text-text placeholder:text-text-subtle focus:outline-none"
        />

        {/* suggestions when empty */}
        {prompt.trim().length === 0 && (
          <div className="mt-1 flex flex-wrap gap-1.5">
            {PROMPT_SUGGESTIONS.slice(0, 2).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setPrompt(s)}
                className="truncate rounded-full border border-dashed border-[var(--border-strong)] px-2.5 py-1 text-[11px] text-text-muted transition-colors hover:border-accent hover:text-accent cursor-pointer max-w-full"
              >
                <Icon name="sparkle" className="mr-1 inline size-3 align-[-2px]" />
                {s.length > 42 ? s.slice(0, 42) + "…" : s}
              </button>
            ))}
          </div>
        )}

        <div className="mt-2 flex items-center justify-between gap-2 border-t border-[var(--border)] pt-2">
          <span className="font-mono text-[11px] text-text-subtle">
            {prompt.length}/{appConfig.limits.promptMaxLength}
          </span>
          <Button
            size="md"
            onClick={generate}
            loading={isGenerating}
            disabled={!canGenerate}
            className="min-w-[140px]"
          >
            {!isGenerating && <Icon name="sparkle" className="size-4" />}
            {isGenerating ? "Generating…" : "Generate"}
          </Button>
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="flex items-center gap-2 rounded-xl border border-red-300/50 bg-red-500/10 px-3 py-2 text-xs text-red-600 dark:text-red-400"
        >
          <Icon name="info" className="size-4 shrink-0" />
          {error}
        </p>
      )}

      {/* count + model */}
      <div className="grid grid-cols-2 gap-2">
        <Dropdown
          renderTrigger={({ open }) => (
            <TriggerBox label={unitLabel} value={`${count}`} open={open} icon="grid" />
          )}
        >
          {IMAGE_COUNTS.map((n) => (
            <DropdownItem key={n} selected={n === count} onSelect={() => setCount(n)}>
              {n} {n === 1 ? unit : `${unit}s`}
            </DropdownItem>
          ))}
        </Dropdown>

        <Dropdown
          align="right"
          panelClassName="min-w-[16rem]"
          renderTrigger={({ open }) => (
            <TriggerBox label="Model" value={activeModel.name} open={open} icon="layers" />
          )}
        >
          {MODELS.map((m) => (
            <DropdownItem key={m.id} selected={m.id === model} onSelect={() => setModel(m.id)}>
              <span className="flex flex-col">
                <span className="flex items-center gap-2">
                  {m.name}
                  <span className="rounded bg-surface-sunken px-1.5 py-0.5 text-[10px] text-text-muted">
                    {m.speed}
                  </span>
                </span>
                <span className="text-[11px] text-text-subtle">{m.tagline}</span>
              </span>
            </DropdownItem>
          ))}
        </Dropdown>
      </div>

      {/* advanced */}
      <Collapsible title="Advanced" icon="sliders">
        <div className="flex flex-col gap-4 pt-2">
          <div>
            <span className="mb-2 block text-xs font-medium text-text">Aspect ratio</span>
            <AspectRatioPicker value={ratio} onChange={setRatio} />
          </div>
          <Slider
            label="Prompt guidance"
            value={advanced.guidance}
            min={1}
            max={15}
            step={0.5}
            onChange={(v) => setAdvanced((a) => ({ ...a, guidance: v }))}
            hint="How strictly the model follows your words."
          />
          <Slider
            label="Quality steps"
            value={advanced.steps}
            min={10}
            max={50}
            onChange={(v) => setAdvanced((a) => ({ ...a, steps: v }))}
            hint="More steps = more detail, slower render."
          />
          <div>
            <label htmlFor="seed" className="mb-1.5 block text-xs font-medium text-text">
              Seed
            </label>
            <div className="flex gap-2">
              <input
                id="seed"
                value={advanced.seed}
                onChange={(e) => setAdvanced((a) => ({ ...a, seed: e.target.value.replace(/\D/g, "") }))}
                placeholder="Random"
                inputMode="numeric"
                className="h-9 flex-1 rounded-xl border border-[var(--border)] bg-surface px-3 text-sm text-text placeholder:text-text-subtle focus:border-accent focus:outline-none"
              />
              <button
                type="button"
                onClick={randomizeSeed}
                aria-label="Randomize seed"
                title="Randomize seed"
                className="grid size-9 place-items-center rounded-xl border border-[var(--border)] bg-surface text-text-muted transition-colors hover:text-accent hover:border-accent cursor-pointer"
              >
                <Icon name="dice" className="size-[18px]" />
              </button>
            </div>
          </div>
        </div>
      </Collapsible>

      {/* styles */}
      <Collapsible title="Styles" icon="sparkle" badge={activeStyle && activeStyle.id !== "none" ? activeStyle.label : null}>
        <div className="pt-2">
          <StylePicker value={style} onChange={setStyle} />
        </div>
      </Collapsible>
    </div>
  );
}

/** Dropdown trigger styled as a labeled field. */
function TriggerBox({ label, value, open, icon }) {
  return (
    <div
      className={cn(
        "flex h-11 items-center gap-2 rounded-xl border bg-surface px-3 text-left transition-colors",
        open ? "border-accent" : "border-[var(--border)] hover:border-[var(--border-strong)]"
      )}
    >
      <Icon name={icon} className="size-4 shrink-0 text-text-muted" />
      <span className="min-w-0 flex-1">
        <span className="block text-[10px] uppercase tracking-wide text-text-subtle">
          {label}
        </span>
        <span className="block truncate text-sm font-medium text-text">{value}</span>
      </span>
      <Icon
        name="chevronDown"
        className={cn("size-4 shrink-0 text-text-muted transition-transform", open && "rotate-180")}
      />
    </div>
  );
}
