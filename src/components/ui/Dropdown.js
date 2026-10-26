"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import Icon from "./Icon";

/**
 * Accessible popover dropdown.
 * - Opens/closes on trigger click, closes on outside-click or Escape.
 * - Returns focus to the trigger on close (keyboard-friendly).
 * `renderTrigger({ open })` lets callers style the button however they like.
 */
export default function Dropdown({
  renderTrigger,
  children,
  align = "left",
  direction = "down",
  panelClassName = "",
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="w-full cursor-pointer"
      >
        {renderTrigger({ open })}
      </button>

      {open && (
        <div
          role="menu"
          className={cn(
            "absolute z-40 min-w-[12rem] rounded-xl border border-[var(--border)]",
            "bg-surface-raised p-1.5 card-shadow-lg animate-scale-in",
            // open upward when anchored to the bottom (e.g. the command bar)
            direction === "up"
              ? "bottom-full mb-2 origin-bottom"
              : "top-full mt-2 origin-top",
            align === "right" ? "right-0" : "left-0",
            panelClassName
          )}
          // let child buttons close the menu via this context-free callback
          onClick={(e) => {
            if (e.target.closest("[data-close-on-click]")) setOpen(false);
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

/** A ready-made option row for use inside a Dropdown panel. */
export function DropdownItem({
  selected = false,
  onSelect,
  children,
  closeOnClick = true,
}) {
  return (
    <button
      type="button"
      role="menuitemradio"
      aria-checked={selected}
      data-close-on-click={closeOnClick || undefined}
      onClick={onSelect}
      className={cn(
        "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm",
        "transition-colors cursor-pointer hover:bg-surface-soft",
        selected ? "text-accent font-medium" : "text-text"
      )}
    >
      <span className="min-w-0">{children}</span>
      {selected && <Icon name="check" className="size-4 shrink-0 text-accent" />}
    </button>
  );
}
