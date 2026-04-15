import { AlarmScheduler } from "@/components/AlarmScheduler";
import { TaskFilters, type TaskFilter } from "@/components/TaskFilters";
import { TaskForm } from "@/components/TaskForm";
import { TaskRow } from "@/components/TaskRow";
import { taskStatus } from "@/lib/db/schema";
import { getDb } from "@/lib/db/client";
import { listOwners } from "@/lib/owners/service";
import { listTasksFiltered } from "@/lib/tasks/service";

export const dynamic = "force-dynamic";

type SearchParams = { status?: string; owner?: string };

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<React.ReactElement> {
  const params = await searchParams;
  const db = getDb();
  const owners = listOwners(db);

  const filter: TaskFilter = {
    status: parseStatus(params.status),
    ownerId: params.owner && owners.some((o) => o.id === params.owner) ? params.owner : undefined,
  };

  const tasks = listTasksFiltered(db, filter);

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">Tasks</h1>
        <p className="text-text-muted">Your upcoming and overdue items.</p>
      </header>

      <TaskForm owners={owners} />
      <TaskFilters current={filter} owners={owners} />

      {tasks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface/60 p-10 text-center">
          <p className="text-text-muted">No tasks match this filter.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <TaskRow key={task.id} task={task} />
          ))}
        </ul>
      )}

      <AlarmScheduler tasks={tasks} />
    </section>
  );
}

function parseStatus(input: string | undefined): TaskFilter["status"] {
  if (input && (taskStatus as readonly string[]).includes(input)) {
    return input as TaskFilter["status"];
  }
  return undefined;
}
