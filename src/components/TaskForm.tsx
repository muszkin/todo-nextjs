import { createTaskAction } from "@/app/actions";
import { recurrenceKinds } from "@/lib/db/schema";
import type { OwnerDto } from "@/lib/schemas/owner";

export function TaskForm({ owners }: { owners: OwnerDto[] }): React.ReactElement {
  return (
    <form
      action={createTaskAction}
      className="rounded-2xl border border-border bg-surface p-4 flex flex-col gap-3"
    >
      <div className="flex flex-col sm:flex-row gap-3">
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
        <select
          name="recurrence"
          defaultValue="none"
          aria-label="Recurrence"
          className="bg-surface-2 border border-border rounded-xl px-3 py-2 text-text focus:outline-none focus:border-accent"
        >
          {recurrenceKinds.map((r) => (
            <option key={r} value={r}>
              {r === "none" ? "no repeat" : r}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-xl bg-accent/20 text-accent border border-accent/40 px-4 py-2 font-medium hover:bg-accent/30 transition-colors"
        >
          Add
        </button>
      </div>

      {owners.length > 0 && (
        <fieldset className="flex flex-wrap items-center gap-2 pt-1">
          <legend className="sr-only">Assign owners</legend>
          <span className="text-xs text-text-muted">Owners:</span>
          {owners.map((owner) => (
            <label
              key={owner.id}
              className="cursor-pointer text-xs px-2.5 py-1 rounded-full border border-border bg-surface-2 hover:border-accent/60 has-checked:bg-accent/20 has-checked:text-accent has-checked:border-accent/40 transition-colors"
            >
              <input
                type="checkbox"
                name="ownerIds"
                value={owner.id}
                className="sr-only"
              />
              {owner.name}
            </label>
          ))}
        </fieldset>
      )}
    </form>
  );
}
