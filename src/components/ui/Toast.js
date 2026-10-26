"use client";

import { createContext, useCallback, useContext, useState } from "react";
import Icon from "./Icon";

const ToastContext = createContext({ toast: () => {} });

/** Access the toast function anywhere: const { toast } = useToast(). */
export function useToast() {
  return useContext(ToastContext);
}

/**
 * Minimal toast system. Every transient confirmation or "not yet available"
 * action routes through here so no control is ever a silent dead click.
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((message, opts = {}) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((list) => [...list, { id, message, icon: opts.icon }]);
    setTimeout(
      () => setToasts((list) => list.filter((t) => t.id !== id)),
      opts.duration || 2600
    );
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-5 z-[70] flex flex-col items-center gap-2 px-4"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className="pointer-events-auto flex items-center gap-2 rounded-xl border border-[var(--border)] bg-surface-raised px-4 py-2.5 text-sm font-medium text-text card-shadow-lg"
            style={{ animation: "fomi-fade-up 0.25s cubic-bezier(0.22,1,0.36,1) both" }}
          >
            <Icon name={t.icon || "sparkle"} className="size-4 text-accent" />
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
