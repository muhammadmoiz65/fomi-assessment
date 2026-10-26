import { ASPECT_RATIOS } from "./constants";
import { uid } from "./utils";

/**
 * Mock generation layer.
 * ---------------------------------------------------------------
 * Stands in for Fomi's real inference API. It returns realistically
 * shaped records (id, url, prompt, model, dimensions, timing...) so the
 * frontend architecture is identical to one wired to a real backend —
 * only the data source is fake.
 */

// Soft blush gradient used as the blur-up placeholder for every image.
// URL-encoded (not base64) so it is isomorphic — safe to import into
// client components without relying on Node's Buffer.
export const BLUR_DATA_URL =
  "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='8'%20height='10'%3E%3Crect%20width='8'%20height='10'%20fill='%23f5e9e2'/%3E%3Crect%20width='8'%20height='5'%20fill='%23fdeee8'/%3E%3C/svg%3E";

// Royalty-free sample clips (Google's public test bucket) stand in for
// generated video. Posters come from Picsum so cards paint instantly.
// W3C-hosted H.264 clips: reliable, small enough to load quickly, and
// each carries an audio track so the lightbox's unmute control works.
const SAMPLE_VIDEOS = [
  "https://media.w3.org/2010/05/video/movie_300.mp4",
  "https://media.w3.org/2010/05/sintel/trailer.mp4",
  "https://media.w3.org/2010/05/bunny/trailer.mp4",
];

function ratioById(id) {
  return ASPECT_RATIOS.find((r) => r.id === id) || ASPECT_RATIOS[0];
}

/** Scale an aspect ratio up to real pixel dimensions (longest side ~896px). */
function dimensionsFor(ratioId) {
  const r = ratioById(ratioId);
  const base = 896;
  if (r.w >= r.h) return { w: base, h: Math.round((base * r.h) / r.w) };
  return { w: Math.round((base * r.w) / r.h), h: base };
}

/**
 * Curated, hand-picked Lorem Picsum photo IDs grouped by subject, so
 * generated results look intentional and relevant to the prompt instead
 * of random stock — a real model returns on-topic, high-quality samples.
 */
const CURATED = {
  // "pv:N" = a pravatar face portrait (real faces); numbers = Picsum ids.
  portrait: ["pv:1", "pv:5", "pv:9", "pv:12", "pv:16", "pv:20", "pv:25", "pv:31", "pv:36", "pv:44", "pv:48", "pv:52", "pv:60", "pv:65"],
  landscape: [15, 29, 37, 54, 66, 110, 116, 10, 11, 17, 28, 62, 70, 93, 61, 68],
  city: [49, 44, 57, 78, 84, 117, 58, 77, 101],
  product: [21, 63, 30, 26, 36, 24, 20, 48],
  abstract: [56, 53, 23, 115, 41, 39, 104, 32],
  animal: [40, 65, 64, 50],
  food: [102, 75, 63, 30, 24],
  default: [64, 15, 49, 56, 110, 37, 29, 91, 78, 21, 102, 57, 66, 116, 84, 44],
};

/** Map a prompt to the closest subject pool via keyword matching. */
function categoryFor(prompt = "") {
  const p = prompt.toLowerCase();
  if (/portrait|woman|\bman\b|person|people|face|model|girl|boy|selfie|headshot|human/.test(p)) return "portrait";
  if (/\bcat\b|\bdog\b|animal|bird|pet|wildlife|puppy|kitten|horse/.test(p)) return "animal";
  if (/food|fruit|meal|dish|cake|drink|coffee|cuisine|bread/.test(p)) return "food";
  if (/city|building|street|architect|urban|skyline|house|tower|bridge|interior|\broom\b/.test(p)) return "city";
  if (/product|mug|bottle|shoe|packshot|still life|flatlay|watch|gadget|device|packaging/.test(p)) return "product";
  if (/abstract|bokeh|pattern|texture|gradient|neon|geometric|liquid|render|surreal/.test(p)) return "abstract";
  if (/landscape|mountain|lake|forest|sunset|nature|ocean|sea|beach|\bsky\b|river|valley|field|dawn|dusk|cityscape|waterfall|desert/.test(p)) return "landscape";
  return "default";
}

/** Stable number from a pool entry (which may be a Picsum id or "pv:N"). */
function hashEntry(entry) {
  const s = String(entry);
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

/** Build an image url from a pool entry: a Picsum id, or "pv:N" (pravatar face). */
function buildUrl(entry, w, h) {
  if (typeof entry === "string" && entry.startsWith("pv:")) {
    return `https://i.pravatar.cc/${Math.max(w, h)}?img=${entry.slice(3)}`;
  }
  return `https://picsum.photos/id/${entry}/${w}/${h}`;
}

/** Pick `count` ids from a pool, rotating from a random start for variety. */
function pickIds(pool, count) {
  const start = Math.floor(Math.random() * pool.length);
  return Array.from({ length: count }, (_, i) => pool[(start + i) % pool.length]);
}

function makeImageItem({ id, prompt, model, style, ratioId }) {
  const { w, h } = dimensionsFor(ratioId);
  return {
    id: uid("img"),
    type: "image",
    picId: id,
    url: buildUrl(id, w, h),
    width: w,
    height: h,
    prompt,
    model,
    style,
    ratio: ratioId,
    seed: 100000 + ((hashEntry(id) * 7919) % 900000),
    favorite: false,
    createdAt: new Date().toISOString(),
  };
}

function makeVideoItem({ id, prompt, model, style, ratioId, index }) {
  const { w, h } = dimensionsFor(ratioId);
  const src = SAMPLE_VIDEOS[index % SAMPLE_VIDEOS.length];
  return {
    id: uid("vid"),
    type: "video",
    picId: id,
    url: src,
    poster: buildUrl(id, w, h),
    width: w,
    height: h,
    duration: 4 + (hashEntry(id) % 5) + 1,
    prompt,
    model,
    style,
    ratio: ratioId,
    favorite: false,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Produce a batch of generated items, matched to the prompt's subject and
 * de-duplicated within the batch.
 * @param {object} opts
 * @param {"image"|"video"} opts.mode
 * @param {string} opts.prompt
 * @param {number} opts.count
 * @param {string} opts.model
 * @param {string} opts.style
 * @param {string} opts.ratio  aspect-ratio id (e.g. "3:4")
 */
export function generateBatch({
  mode = "image",
  prompt = "",
  count = 4,
  model = "fomi-core",
  style = "none",
  ratio = "1:1",
}) {
  const pool = CURATED[categoryFor(prompt)] || CURATED.default;
  const ids = pickIds(pool, count);
  const make = mode === "video" ? makeVideoItem : makeImageItem;
  return ids.map((id, index) =>
    make({ id, prompt, model, style, ratioId: ratio, index })
  );
}

/**
 * A pre-seeded history reel so the studio never opens empty — the brief
 * assumes a returning professional with existing work. Each thumbnail is
 * matched to its prompt's subject.
 */
export function seedHistory() {
  const prompts = [
    "Editorial portrait, auburn hair, soft window light",
    "Neon-lit alley at night, cinematic",
    "Still life with citrus and ceramics",
    "Mountain lake at dawn, long exposure",
    "Retro poster, bold colours",
    "Botanical study, soft light",
    "Golden retriever puppy, studio",
    "Abstract liquid metal render",
    "Cozy reading nook, warm tones",
    "Street fashion portrait, overcast day",
    "Macro of a dew-covered leaf",
    "Minimal architecture, concrete & light",
  ];
  const { w, h } = dimensionsFor("1:1");
  return prompts.map((prompt, i) => {
    const pool = CURATED[categoryFor(prompt)] || CURATED.default;
    const id = pool[i % pool.length];
    return {
      id: uid("hist"),
      type: "image",
      picId: id,
      url: buildUrl(id, w, h),
      width: w,
      height: h,
      prompt,
      model: "fomi-core",
      style: "none",
      ratio: "1:1",
      favorite: i % 5 === 0,
      createdAt: new Date(Date.now() - (i + 1) * 3600_000).toISOString(),
    };
  });
}
