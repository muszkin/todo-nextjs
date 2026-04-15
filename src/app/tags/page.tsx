import { createTagAction, deleteTagAction } from "@/app/actions";
import { getDb } from "@/lib/db/client";
import { listTags } from "@/lib/tags/service";

export const dynamic = "force-dynamic";

export default function TagsPage(): React.ReactElement {
  const tagsList = listTags(getDb());

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">Tags</h1>
        <p className="text-text-muted">Label tasks with lowercase tags.</p>
      </header>

      <form
        action={createTagAction}
        className="rounded-2xl border border-border bg-surface p-4 flex flex-col sm:flex-row gap-3"
      >
        <input
          type="text"
          name="name"
          required
          maxLength={40}
          pattern="[a-z0-9][a-z0-9-]*"
          placeholder="e.g. work, personal, urgent"
          className="flex-1 bg-surface-2 border border-border rounded-xl px-3 py-3 text-base text-text placeholder:text-text-muted focus:outline-none focus:border-accent"
        />
        <button
          type="submit"
          className="min-h-12 rounded-xl bg-accent/20 text-accent border border-accent/40 px-4 py-2 font-medium hover:bg-accent/30 transition-colors"
        >
          Add tag
        </button>
      </form>

      {tagsList.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface/60 p-10 text-center">
          <p className="text-text-muted">No tags yet.</p>
        </div>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {tagsList.map((tag) => (
            <li
              key={tag.id}
              className="flex items-center gap-1 rounded-full border border-border bg-surface pl-3 pr-1 py-1"
            >
              <span className="text-sm text-text">#{tag.name}</span>
              <form action={deleteTagAction}>
                <input type="hidden" name="id" value={tag.id} />
                <button
                  type="submit"
                  aria-label={`Delete tag ${tag.name}`}
                  className="w-8 h-8 rounded-full text-text-muted hover:bg-rose/15 hover:text-rose transition-colors"
                >
                  ✕
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
