import { createTaskAction } from "@/app/actions";

export function TaskForm(): React.ReactElement {
  return (
    <form
      action={createTaskAction}
      className="rounded-2xl border border-border bg-surface p-4 flex flex-col sm:flex-row gap-3"
    >
      <input
        type="text"
        name="title"
        required
        maxLength={500}
        placeholder="What needs doing?"
        className="flex-1 bg-surface-2 border border-border rounded-xl px-3 py-2 text-text placeholder:text-text-muted focus:outline-none focus:border-accent"
      />
      <input
        type="datetime-local"
        name="dueAt"
        required
        className="bg-surface-2 border border-border rounded-xl px-3 py-2 text-text focus:outline-none focus:border-accent"
      />
      <button
        type="submit"
        className="rounded-xl bg-accent/20 text-accent border border-accent/40 px-4 py-2 font-medium hover:bg-accent/30 transition-colors"
      >
        Add
      </button>
    </form>
  );
}
