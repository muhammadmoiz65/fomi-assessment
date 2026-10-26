import { cn } from "@/lib/utils";

/** Shimmering placeholder box. `ratio` keeps layout stable before load. */
export default function Skeleton({ className = "", ratio, style }) {
  return (
    <div
      className={cn("skeleton rounded-xl", className)}
      style={{ aspectRatio: ratio, ...style }}
      aria-hidden="true"
    />
  );
}
