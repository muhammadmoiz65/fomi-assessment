import { cn } from "@/lib/utils";
import { appConfig } from "@/config/app.config";

/** Fomi wordmark / glyph. The "F" badge mirrors the mockup's top-left logo. */
export default function Logo({ withWordmark = false, className = "" }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span
        className="grid size-8 place-items-center rounded-[10px] bg-accent text-[var(--accent-contrast)] font-semibold"
        aria-hidden="true"
        style={{ boxShadow: "0 4px 12px -4px var(--ring)" }}
      >
        <span className="text-lg leading-none" style={{ fontFamily: "var(--font-sans)" }}>
          {appConfig.brand.logoLetter}
        </span>
      </span>
      {withWordmark && (
        <span className="text-[17px] font-semibold tracking-tight text-text">
          {appConfig.brand.name}
        </span>
      )}
    </span>
  );
}
