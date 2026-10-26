"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/ui/Logo";
import Icon from "@/components/ui/Icon";
import IconButton from "@/components/ui/IconButton";
import Dropdown from "@/components/ui/Dropdown";
import ThemeToggle from "./ThemeToggle";
import { cn } from "@/lib/utils";
import { appConfig } from "@/config/app.config";
import { useToast } from "@/components/ui/Toast";

// Center cluster mirrors the mockup's icon row. Sourced from the global
// config so navigation is defined in one place.
const NAV = appConfig.nav.primary;

// Single active item: the longest matching base path wins, ties go to the
// first entry — so overlapping "/" links never light up together.
function activeIndexFor(pathname) {
  let best = -1;
  let bestLen = -1;
  NAV.forEach((item, i) => {
    const base = item.href.split("?")[0];
    const match = base === "/" ? pathname === "/" : pathname.startsWith(base);
    if (match && base.length > bestLen) {
      best = i;
      bestLen = base.length;
    }
  });
  return best;
}

export default function TopNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const activeIndex = activeIndexFor(pathname);
  const { toast } = useToast();
  const headerRef = useRef(null);

  // Close the mobile menu on outside click or Escape — not just the X.
  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <header ref={headerRef} className="sticky top-0 z-30 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--canvas)_80%,transparent)] backdrop-blur-md">
      <div className="mx-auto flex h-[var(--header-h)] max-w-[1600px] items-center gap-3 px-4 sm:px-6">
        {/* left: logo */}
        <Link href="/" className="flex items-center" aria-label="Fomi home">
          <Logo withWordmark className="shrink-0" />
        </Link>

        {/* center: primary nav (desktop) */}
        <nav
          aria-label="Primary"
          className="mx-auto hidden items-center gap-1 rounded-2xl border border-[var(--border)] bg-surface/70 p-1 md:flex"
        >
          {NAV.map((item, i) => {
            const active = i === activeIndex;
            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={active ? "page" : undefined}
                title={item.label}
                className={cn(
                  "relative grid size-10 place-items-center rounded-xl transition-all duration-200",
                  active
                    ? "bg-accent text-[var(--accent-contrast)] shadow-[0_4px_12px_-4px_var(--ring)]"
                    : "text-text-muted hover:bg-surface-soft hover:text-text"
                )}
              >
                <Icon name={item.icon} className="size-[18px]" />
                <span className="sr-only">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* right: actions */}
        <div className="ml-auto flex items-center gap-1.5 md:ml-0">
          {appConfig.nav.actions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="hidden items-center gap-1.5 rounded-xl px-3 py-2 text-sm text-text-muted transition-colors hover:bg-surface-soft hover:text-text lg:inline-flex"
            >
              <Icon name={action.icon} className="size-[18px]" />
              {action.label}
            </Link>
          ))}

          <ThemeToggle />

          {/* account menu */}
          <Dropdown
            align="right"
            panelClassName="min-w-[13rem]"
            className="ml-0.5"
            renderTrigger={() => (
              <span
                aria-label="Account menu"
                title={appConfig.brand.userName}
                className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-accent to-[#f0a98f] text-[13px] font-semibold text-white ring-2 ring-[var(--border)] transition-transform hover:scale-105"
              >
                {appConfig.brand.userInitials}
              </span>
            )}
          >
            <div className="border-b border-[var(--border)] px-3 py-2">
              <p className="truncate text-sm font-semibold text-text">
                {appConfig.brand.userName}
              </p>
              <p className="text-xs text-text-muted">Signed in · Pro plan</p>
            </div>
            <div className="py-1">
              <Link
                href="/workspace"
                data-close-on-click
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-text transition-colors hover:bg-surface-soft"
              >
                <Icon name="edit" className="size-4 text-text-muted" />
                Pro Workspace
              </Link>
              <Link
                href="/product-thinking"
                data-close-on-click
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-text transition-colors hover:bg-surface-soft"
              >
                <Icon name="folder" className="size-4 text-text-muted" />
                Product Notes
              </Link>
              <button
                type="button"
                data-close-on-click
                onClick={() => toast("Demo account — sign-out isn’t available", { icon: "info" })}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-text transition-colors hover:bg-surface-soft cursor-pointer"
              >
                <Icon name="arrowRight" className="size-4 text-text-muted" />
                Sign out
              </button>
            </div>
          </Dropdown>

          {/* mobile menu trigger */}
          <IconButton
            icon={menuOpen ? "close" : "menu"}
            label="Menu"
            variant="ghost"
            className="md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
          />
        </div>
      </div>

      {/* mobile nav drawer */}
      {menuOpen && (
        <nav
          aria-label="Primary mobile"
          className="border-t border-[var(--border)] bg-surface px-4 py-3 md:hidden animate-fade-up"
        >
          <ul className="grid grid-cols-1 gap-1">
            {NAV.map((item, i) => {
              const active = i === activeIndex;
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                      active
                        ? "bg-accent-soft text-accent font-medium"
                        : "text-text hover:bg-surface-soft"
                    )}
                  >
                    <Icon name={item.icon} className="size-5" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
}
