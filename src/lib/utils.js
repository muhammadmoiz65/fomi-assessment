/**
 * Tiny class-name joiner (keeps the dependency surface small — no clsx).
 * Falsy values are dropped so conditional classes read cleanly in JSX.
 */
export function cn(...parts) {
  return parts.filter(Boolean).join(" ");
}

/** Deterministic pseudo-random in [0,1) from a string seed. */
export function seededRandom(seed) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  // xorshift finish for better distribution
  h ^= h << 13;
  h ^= h >>> 17;
  h ^= h << 5;
  return ((h >>> 0) % 100000) / 100000;
}

/** "2 minutes ago" style relative time from an ISO string or Date. */
export function timeAgo(input) {
  const date = input instanceof Date ? input : new Date(input);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  const table = [
    ["year", 31536000],
    ["month", 2592000],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [label, secs] of table) {
    const value = Math.floor(seconds / secs);
    if (value >= 1) return `${value} ${label}${value > 1 ? "s" : ""} ago`;
  }
  return "just now";
}

/** A lightweight unique id without pulling in a uuid dependency. */
export function uid(prefix = "id") {
  return `${prefix}_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

/**
 * Trigger a direct download of a generated item through our download proxy,
 * so the browser saves the file instead of opening it in a new tab.
 */
export function downloadItem(item) {
  const name = `fomi-${item.id}.${item.type === "video" ? "mp4" : "jpg"}`;
  const href = `/api/download?url=${encodeURIComponent(
    item.url
  )}&name=${encodeURIComponent(name)}`;
  const a = document.createElement("a");
  a.href = href;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
