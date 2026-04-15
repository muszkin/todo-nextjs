import Link from "next/link";
import { CalendarGrid } from "@/components/CalendarGrid";
import { getDb } from "@/lib/db/client";
import { listTasksInRange } from "@/lib/tasks/service";

export const dynamic = "force-dynamic";

type SearchParams = { month?: string };

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<React.ReactElement> {
  const params = await searchParams;
  const today = new Date();
  const { year, month } = parseMonth(params.month, today);

  const monthStart = new Date(year, month, 1);
  const monthEnd = new Date(year, month + 1, 1);
  const tasks = listTasksInRange(getDb(), monthStart, monthEnd);

  const prev = monthKey(year, month - 1);
  const next = monthKey(year, month + 1);
  const monthLabel = monthStart.toLocaleString("pl-PL", { month: "long", year: "numeric" });

  return (
    <section className="space-y-6">
      <header className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">Calendar</h1>
          <p className="text-text-muted capitalize">{monthLabel}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/calendar?month=${prev}`}
            className="rounded-full border border-border bg-surface px-3 py-1.5 text-sm text-text-muted hover:text-text hover:border-accent/60 transition-colors"
          >
            ← prev
          </Link>
          <Link
            href="/calendar"
            className="rounded-full border border-border bg-surface px-3 py-1.5 text-sm text-text-muted hover:text-text hover:border-accent/60 transition-colors"
          >
            today
          </Link>
          <Link
            href={`/calendar?month=${next}`}
            className="rounded-full border border-border bg-surface px-3 py-1.5 text-sm text-text-muted hover:text-text hover:border-accent/60 transition-colors"
          >
            next →
          </Link>
        </div>
      </header>

      <CalendarGrid year={year} month={month} tasks={tasks} today={today} />
    </section>
  );
}

function parseMonth(input: string | undefined, fallback: Date): { year: number; month: number } {
  if (input && /^\d{4}-\d{2}$/.test(input)) {
    const [y, m] = input.split("-").map(Number);
    return { year: y, month: m - 1 };
  }
  return { year: fallback.getFullYear(), month: fallback.getMonth() };
}

function monthKey(year: number, month: number): string {
  const d = new Date(year, month, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
