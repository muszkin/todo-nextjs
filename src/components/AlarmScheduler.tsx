"use client";

import { useEffect, useRef, useState } from "react";
import type { TaskDto } from "@/lib/schemas/task";

const SCHEDULE_WINDOW_MS = 24 * 60 * 60 * 1000;
const TOAST_TTL_MS = 30_000;

type Alarm = { id: string; title: string; firedAt: number };

export function AlarmScheduler({ tasks }: { tasks: TaskDto[] }): React.ReactElement {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const firedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().catch(() => {});
    }
  }, []);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const now = Date.now();

    for (const task of tasks) {
      if (task.status !== "todo") continue;
      if (firedRef.current.has(task.id)) continue;

      const dueMs = new Date(task.dueAt).getTime();
      const delay = dueMs - now;
      if (delay > SCHEDULE_WINDOW_MS) continue;

      const fire = () => {
        if (firedRef.current.has(task.id)) return;
        firedRef.current.add(task.id);
        setAlarms((prev) => [...prev, { id: task.id, title: task.title, firedAt: Date.now() }]);
        playBeep();
        notify(task.title);
        setTimeout(() => {
          setAlarms((prev) => prev.filter((a) => a.id !== task.id));
        }, TOAST_TTL_MS);
      };

      if (delay <= 0) {
        fire();
      } else {
        timers.push(setTimeout(fire, delay));
      }
    }

    return () => {
      for (const t of timers) clearTimeout(t);
    };
  }, [tasks]);

  const dismiss = (id: string): void => {
    setAlarms((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div
      aria-live="polite"
      aria-label="Task alarms"
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm"
    >
      {alarms.map((alarm) => (
        <div
          key={alarm.id}
          role="alert"
          className="rounded-2xl border border-accent/60 bg-surface-2 shadow-lg p-4 flex items-start gap-3 animate-in"
        >
          <div className="text-accent text-xl leading-none mt-0.5">⏰</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text">Task due</p>
            <p className="text-sm text-text-muted truncate">{alarm.title}</p>
          </div>
          <button
            onClick={() => dismiss(alarm.id)}
            aria-label="Dismiss"
            className="text-text-muted hover:text-text"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

function notify(title: string): void {
  try {
    if (typeof window === "undefined") return;
    if (!("Notification" in window)) return;
    if (Notification.permission !== "granted") return;
    new Notification("Task due", { body: title, tag: title });
  } catch {
    // notification blocked or unsupported
  }
}

function playBeep(): void {
  try {
    const Ctor: typeof AudioContext | undefined =
      typeof window === "undefined"
        ? undefined
        : window.AudioContext ??
          (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;
    const ctx = new Ctor();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 880;
    gain.gain.value = 0.15;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.25);
    osc.onended = () => ctx.close();
  } catch {
    // audio blocked or unsupported — silent fallback
  }
}
