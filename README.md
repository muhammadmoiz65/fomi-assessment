# Fomi — AI Creative Studio

A responsive, production-quality frontend for an AI image & video generation
platform, built for the Fomi Frontend Developer assessment.

**Live demo:** _add your Vercel URL here_

The submission contains **two independent pieces**:

| Route | What it is |
|-------|------------|
| `/` | **Part A** — a faithful, responsive implementation of the provided mockup (the AI content-generation page). |
| `/workspace` | **Part B** — an original "Pro" workspace reimagined around *generation lineage*. |
| `/product-thinking` | **Part B** — the written product-thinking document. |

---

## Tech stack

- **Next.js 16** (App Router)
- **JavaScript** (no TypeScript, per the brief)
- **Tailwind CSS v4** (design tokens via `@theme` + CSS custom properties)
- **next/image** for optimised, lazy-loaded media
- Mock backend via **Next.js Route Handlers**

---

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

Build / run production:

```bash
npm run build
npm run start
```

> On a memory-constrained machine the production build can run out of RAM
> during page-data collection. If that happens locally, give Node more heap:
> `NODE_OPTIONS=--max-old-space-size=4096 npm run build`. Vercel builds with
> no special flags.

---

## Architecture

```
src/
├─ config/
│  └─ app.config.js        ← single source of truth for every dynamic value
├─ app/
│  ├─ layout.js            ← fonts, metadata, no-flash theme bootstrap
│  ├─ page.js              ← Part A (studio)
│  ├─ workspace/           ← Part B (pro workspace)
│  ├─ product-thinking/    ← Part B (written document)
│  ├─ globals.css          ← design tokens (light + dark) & keyframes
│  └─ api/
│     ├─ generations/      ← POST — mock image/video generation
│     └─ history/          ← GET  — mock recent generations
├─ components/
│  ├─ ui/                  ← primitives (Button, Dropdown, Segmented, Slider…)
│  ├─ layout/              ← TopNav, ThemeToggle
│  ├─ studio/              ← Part A feature components
│  ├─ workspace/           ← Part B feature components
│  └─ providers/           ← ThemeProvider
├─ hooks/
│  ├─ useStudio.js         ← Part A generation state machine
│  └─ useWorkspace.js      ← Part B lineage state machine
└─ lib/
   ├─ constants.js         ← focused re-exports from the config
   ├─ mockData.js          ← mock generation data layer
   └─ utils.js             ← cn(), seededRandom(), timeAgo()…
```

### Config-driven by design

Everything dynamic — brand text, navigation, API endpoints, model/style/ratio
options, defaults, prompt copy and input limits — lives in a single global
config:

```
src/config/app.config.js
```

No feature component hardcodes these values; they are all read from the config
and called across the app. Change it in one place, it changes everywhere.

Visual styling is centralised separately as **design tokens** in
`src/app/globals.css` (`:root` custom properties + Tailwind `@theme`). The two
layers stay in sync — config = *data & behaviour*, globals.css = *design
tokens* — so colours, spacing, radii and motion are themeable from one place
and drive both light and dark modes.

---

## Mock backend

The brief asks for a realistic frontend architecture, not backend complexity.
`/api/generations` and `/api/history` return realistically-shaped records
(`id`, `url`, `prompt`, `model`, dimensions, timing…) after a short simulated
latency, so the UI exercises genuine loading, empty and error states. Imagery
is served from Lorem Picsum and public sample videos; swapping in a real
inference API would only change the data source, not the components.

---

## What was built with care

- **Responsiveness** — intentional layouts at mobile / tablet / desktop / large
  screens; no horizontal scroll, no overlap. Part B's canvas stays the hero and
  the inspector collapses into a slide-over on small screens.
- **Attention to detail** — hover behaviour, loading skeletons, empty states,
  button feedback, staggered reveals, consistent spacing, smooth theme
  transitions.
- **Accessibility** — semantic HTML, keyboard-operable controls, visible focus
  rings, `aria` roles/labels, alt text, readable contrast in both themes.
- **Performance** — `next/image` with blur-up placeholders, lazy loading,
  minimal dependencies (hand-rolled icon set, no component library), state logic
  isolated in hooks to avoid unnecessary re-renders.

---

## Part B — the idea in one line

> Professional AI work isn't one perfect prompt — it's dozens of refinements.
> Fomi Pro makes **iteration lineage** the spine of the product: every image is
> a node you can branch, compare and refine, with a non-blocking render queue so
> the canvas never locks up.

See `/product-thinking` for the full rationale.

---

## Deployment

Deploys to **Vercel** with zero config (framework auto-detected). Push to GitHub
and import the repo, or run `vercel`.
