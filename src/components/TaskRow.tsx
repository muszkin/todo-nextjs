import type { TaskDto } from "@/lib/schemas/task";

const statusStyles: Record<TaskDto["status"], string> = {
  todo: "bg-sky/15 text-sky",
  done: "bg-mint/15 text-mint",
  not_do: "bg-rose/15 text-rose",
};

const statusLabels: Record<TaskDto["status"], string> = {
  todo: "todo",
  done: "done",
  not_do: "not-do",
};

export function TaskRow({ task }: { task: TaskDto }): React.ReactElement {
  return (
    <li className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-surface px-5 py-4 hover:border-accent/60 transition-colors">
      <div className="min-w-0">
        <p className="truncate font-medium text-text">{task.title}</p>
        <p className="text-xs text-text-muted">{formatDue(task.dueAt)}</p>
      </div>
      <span
        className={
          "shrink-0 px-2.5 py-1 rounded-full text-xs font-medium " + statusStyles[task.status]
        }
      >
        {statusLabels[task.status]}
      </span>
    </li>
  );
}

function formatDue(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("pl-PL", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
