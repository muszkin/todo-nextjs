import { deleteTaskAction, setTaskStatusAction } from "@/app/actions";
import type { OwnerColor } from "@/lib/db/schema";
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

const ownerBadge: Record<OwnerColor, string> = {
  mint: "bg-mint/15 text-mint",
  lavender: "bg-lavender/15 text-lavender",
  peach: "bg-peach/15 text-peach",
  sky: "bg-sky/15 text-sky",
  rose: "bg-rose/15 text-rose",
};

export function TaskRow({ task }: { task: TaskDto }): React.ReactElement {
  const isOpen = task.status === "todo";

  return (
    <li className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-surface px-5 py-4 hover:border-accent/60 transition-colors">
      <div className="min-w-0 flex-1">
        <p
          className={
            "truncate font-medium " +
            (task.status === "todo" ? "text-text" : "text-text-muted line-through")
          }
        >
          {task.title}
        </p>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          <p className="text-xs text-text-muted">{formatDue(task.dueAt)}</p>
          {task.owners.map((owner) => (
            <span
              key={owner.id}
              className={"px-1.5 py-0.5 rounded-full text-[10px] font-medium " + ownerBadge[owner.color]}
            >
              {owner.name}
            </span>
          ))}
        </div>
      </div>

      <span
        className={
          "shrink-0 px-2.5 py-1 rounded-full text-xs font-medium " + statusStyles[task.status]
        }
      >
        {statusLabels[task.status]}
      </span>

      <div className="flex items-center gap-1">
        {isOpen ? (
          <>
            <StatusButton id={task.id} status="done" label="Mark done" icon="✓" tone="mint" />
            <StatusButton id={task.id} status="not_do" label="Skip" icon="⊘" tone="rose" />
          </>
        ) : (
          <StatusButton id={task.id} status="todo" label="Reopen" icon="↺" tone="sky" />
        )}
        <DeleteButton id={task.id} />
      </div>
    </li>
  );
}

function StatusButton({
  id,
  status,
  label,
  icon,
  tone,
}: {
  id: string;
  status: "todo" | "done" | "not_do";
  label: string;
  icon: string;
  tone: "mint" | "rose" | "sky";
}): React.ReactElement {
  const toneClass = {
    mint: "hover:bg-mint/15 hover:text-mint",
    rose: "hover:bg-rose/15 hover:text-rose",
    sky: "hover:bg-sky/15 hover:text-sky",
  }[tone];
  return (
    <form action={setTaskStatusAction}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={status} />
      <button
        type="submit"
        aria-label={label}
        title={label}
        className={"w-8 h-8 rounded-full text-text-muted transition-colors " + toneClass}
      >
        {icon}
      </button>
    </form>
  );
}

function DeleteButton({ id }: { id: string }): React.ReactElement {
  return (
    <form action={deleteTaskAction}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        aria-label="Delete"
        title="Delete"
        className="w-8 h-8 rounded-full text-text-muted hover:bg-rose/15 hover:text-rose transition-colors"
      >
        ✕
      </button>
    </form>
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
