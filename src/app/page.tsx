import { AlarmScheduler } from "@/components/AlarmScheduler";
import { TaskForm } from "@/components/TaskForm";
import { TaskRow } from "@/components/TaskRow";
import { getDb } from "@/lib/db/client";
import { listTasks } from "@/lib/tasks/service";

export const dynamic = "force-dynamic";

export default function HomePage(): React.ReactElement {
  const tasks = listTasks(getDb());

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">Tasks</h1>
        <p className="text-text-muted">Your upcoming and overdue items.</p>
      </header>

      <TaskForm />

      {tasks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface/60 p-10 text-center">
          <p className="text-text-muted">No tasks yet. Add your first one above.</p>
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
