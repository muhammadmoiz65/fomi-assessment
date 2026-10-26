/**
 * Thin, named re-exports of the generation options defined in the global
 * app config. Kept so feature code can import focused names
 * (MODELS, STYLES, …) while `src/config/app.config.js` stays the single
 * source of truth for every dynamic value.
 */
import { appConfig } from "@/config/app.config";

export const MODELS = appConfig.generation.models;
export const STYLES = appConfig.generation.styles;
export const ASPECT_RATIOS = appConfig.generation.aspectRatios;
export const IMAGE_COUNTS = appConfig.generation.imageCounts;
export const ADVANCED_DEFAULTS = appConfig.generation.advancedDefaults;
export const PROMPT_SUGGESTIONS = appConfig.prompts.suggestions;
