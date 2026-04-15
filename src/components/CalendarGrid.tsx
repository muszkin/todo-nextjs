import type { TaskDto } from "@/lib/schemas/task";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

const statusDot: Record<TaskDto["status"], string> = {
  todo: "bg-sky",
  done: "bg-mint",
  not_do: "bg-rose",
};

export function CalendarGrid({
  year,
  month,
  tasks,
  today,
}: {
  year: number;
  month: number;
  tasks: TaskDto[];
  today: Date;
}): React.ReactElement {
  const cells = buildCells(year, month);
  const tasksByDay = groupByDay(tasks);
  const todayKey = isSameMonth(today, year, month) ? today.getDate() : -1;

  return (
    <div className="rounded-2xl border border-border bg-surface overflow-x-auto">
      <div className="min-w-[640px]">
      <div className="grid grid-cols-7 border-b border-border bg-surface-2">
        {WEEKDAYS.map((d) => (
          <div key={d} className="px-2 py-2 text-xs font-medium text-text-muted text-center">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((cell, i) => {
          const dayTasks = cell.day ? tasksByDay.get(cell.day) ?? [] : [];
          const isToday = cell.day === todayKey;
          return (
            <div
              key={i}
              className={
                "min-h-24 border-b border-r border-border p-2 last:border-r-0 " +
                (cell.day ? "" : "bg-surface-2/40")
              }
            >
              {cell.day && (
                <>
                  <div
                    className={
                      "text-xs mb-1 inline-flex items-center justify-center w-6 h-6 rounded-full " +
                      (isToday ? "bg-accent/30 text-accent font-semibold" : "text-text-muted")
                    }
                  >
                    {cell.day}
                  </div>
                  <ul className="space-y-1">
                    {dayTasks.slice(0, 3).map((task) => (
                      <li
                        key={task.id}
                        title={`${task.title} — ${formatTime(task.dueAt)}`}
                        className="flex items-center gap-1.5 text-xs text-text-muted truncate"
                      >
                        <span className={"w-1.5 h-1.5 rounded-full " + statusDot[task.status]} />
                        <span className="truncate">{task.title}</span>
                      </li>
                    ))}
                    {dayTasks.length > 3 && (
                      <li className="text-[10px] text-text-muted">+{dayTasks.length - 3} more</li>
                    )}
                  </ul>
                </>
              )}
            </div>
          );
        })}
      </div>
      </div>
    </div>
  );
}

type Cell = { day: number | null };

function buildCells(year: number, month: number): Cell[] {
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // Monday-first offset
  const offset = (first.getDay() + 6) % 7;

  const cells: Cell[] = [];
  for (let i = 0; i < offset; i++) cells.push({ day: null });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d });
  while (cells.length % 7 !== 0) cells.push({ day: null });
  return cells;
}

function groupByDay(tasks: TaskDto[]): Map<number, TaskDto[]> {
  const map = new Map<number, TaskDto[]>();
  for (const t of tasks) {
    const day = new Date(t.dueAt).getDate();
    const arr = map.get(day) ?? [];
    arr.push(t);
    map.set(day, arr);
  }
  return map;
}

function isSameMonth(date: Date, year: number, month: number): boolean {
  return date.getFullYear() === year && date.getMonth() === month;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" });
}
