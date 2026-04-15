"use client";

import { useEffect, useState } from "react";

const SHORTCUTS = [
  { keys: "⌘K / Ctrl+K", desc: "Focus task title" },
  { keys: "Esc", desc: "Blur input" },
  { keys: "?", desc: "Toggle this help" },
] as const;

export function KeyboardShortcuts(): React.ReactElement {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const isEditable = (el: EventTarget | null): boolean => {
      if (!(el instanceof HTMLElement)) return false;
      const tag = el.tagName;
      return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || el.isContentEditable;
    };

    const onKey = (e: KeyboardEvent): void => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        const input = document.querySelector<HTMLInputElement>('input[name="title"]');
        input?.focus();
        return;
      }
      if (e.key === "Escape" && isEditable(document.activeElement)) {
        (document.activeElement as HTMLElement).blur();
        return;
      }
      if (e.key === "?" && !isEditable(document.activeElement)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!open) return <></>;

  return (
    <div
      role="dialog"
      aria-label="Keyboard shortcuts"
      className="fixed bottom-6 left-6 z-50 rounded-2xl border border-border bg-surface-2 shadow-lg p-4 max-w-xs"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-text">Keyboard shortcuts</h3>
        <button
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="text-text-muted hover:text-text"
        >
          ✕
        </button>
      </div>
      <dl className="space-y-1.5">
        {SHORTCUTS.map((s) => (
          <div key={s.keys} className="flex items-center justify-between gap-4 text-xs">
            <dt className="text-text-muted">{s.desc}</dt>
            <dd className="font-mono text-accent">{s.keys}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
