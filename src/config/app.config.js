/**
 * ============================================================
 *  Fomi — Global Application Config  (single source of truth)
 * ============================================================
 *  Every dynamic value in the app — brand text, navigation, API
 *  endpoints, generation options, defaults, copy and limits — lives
 *  here and is called from across the app. Change it here, it changes
 *  everywhere. No feature component hardcodes these.
 *
 *  Visual styling (colours, radii, shadows, motion) is centralised
 *  separately as design tokens in `src/app/globals.css` (:root custom
 *  properties + Tailwind @theme). The token NAMES this config refers to
 *  map 1:1 to those variables, so the two layers stay in sync:
 *    config = data & behaviour   •   globals.css = design tokens
 * ============================================================
 */

export const appConfig = {
  /* ---- brand / identity ---- */
  brand: {
    name: "Fomi",
    productName: "Fomi — AI Creative Studio",
    tagline: "Turn imagination into professional-quality visuals.",
    description:
      "Fomi is an AI-powered studio for generating, editing and upscaling images and video.",
    logoLetter: "F",
    userInitials: "JD",
    userName: "John Doe",
  },

  /* ---- theme ---- */
  theme: {
    storageKey: "fomi-theme",
    default: "light",
    colors: {
      light: "#faf4f0",
      dark: "#141110",
    },
  },

  /* ---- API endpoints (mock backend) ---- */
  api: {
    generations: "/api/generations",
    history: "/api/history",
    download: "/api/download",
  },

  /* ---- navigation (mirrors the mockup's icon row) ---- */
  nav: {
    primary: [
      { icon: "home", label: "Home", href: "/" },
      { icon: "image", label: "Image Studio", href: "/?mode=image" },
      { icon: "video", label: "Video Studio", href: "/?mode=video" },
      { icon: "edit", label: "Pro Workspace", href: "/workspace" },
      { icon: "folder", label: "Product Notes", href: "/product-thinking" },
    ],
    actions: [
      { icon: "gallery", label: "Gallery", href: "/workspace" },
      { icon: "support", label: "Support", href: "/product-thinking" },
    ],
  },

  /* ---- input limits ---- */
  limits: {
    promptMaxLength: 1000,
  },

  /* ---- generation options & defaults ---- */
  generation: {
    models: [
      { id: "fomi-core", name: "Fomi Core", tagline: "Balanced quality & speed", speed: "Fast" },
      { id: "fomi-lumen", name: "Fomi Lumen", tagline: "Photoreal lighting & skin", speed: "Standard" },
      { id: "fomi-flux", name: "Fomi Flux", tagline: "Bold, stylised compositions", speed: "Standard" },
      { id: "fomi-nova", name: "Fomi Nova", tagline: "Highest fidelity, slower", speed: "Quality" },
    ],
    styles: [
      { id: "none", label: "None" },
      { id: "photographic", label: "Photographic" },
      { id: "cinematic", label: "Cinematic" },
      { id: "portrait", label: "Portrait" },
      { id: "illustration", label: "Illustration" },
      { id: "3d-render", label: "3D Render" },
      { id: "anime", label: "Anime" },
      { id: "product", label: "Product Shot" },
      { id: "watercolor", label: "Watercolor" },
    ],
    aspectRatios: [
      { id: "1:1", label: "Square", w: 1, h: 1 },
      { id: "3:4", label: "Portrait", w: 3, h: 4 },
      { id: "4:3", label: "Landscape", w: 4, h: 3 },
      { id: "16:9", label: "Wide", w: 16, h: 9 },
      { id: "9:16", label: "Story", w: 9, h: 16 },
    ],
    imageCounts: [1, 2, 4, 6, 8],

    // advanced generation parameters (progressive disclosure)
    advancedDefaults: {
      guidance: 7, // how strictly the model follows the prompt
      steps: 30, // sampling steps (quality vs. speed)
      seed: "", // empty = random
    },

    // studio defaults (Part A)
    defaults: {
      mode: "image",
      model: "fomi-core",
      style: "none",
      ratio: "3:4",
      count: 4,
    },
  },

  /* ---- prompt copy ---- */
  prompts: {
    placeholder: "Describe your imagination to be converted into a piece of art…",
    suggestions: [
      "A professional studio portrait of a smiling woman with auburn hair, soft directional light",
      "Golden-hour cityscape, cinematic wide shot, volumetric haze",
      "Minimal product shot of a ceramic mug on linen, soft shadows",
      "Dreamlike watercolor forest with floating lanterns",
    ],
  },

  /* ---- pro workspace defaults (Part B) ---- */
  workspace: {
    defaults: {
      model: "fomi-lumen",
      ratio: "4:3",
      branchSize: 3, // variations created per render
    },
  },
};

export default appConfig;
