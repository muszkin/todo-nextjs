import { createOwnerAction, deleteOwnerAction } from "@/app/actions";
import { ownerColors } from "@/lib/db/schema";
import { getDb } from "@/lib/db/client";
import { listOwners } from "@/lib/owners/service";
import type { OwnerColor } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

const colorBadge: Record<OwnerColor, string> = {
  mint: "bg-mint/20 text-mint",
  lavender: "bg-lavender/20 text-lavender",
  peach: "bg-peach/20 text-peach",
  sky: "bg-sky/20 text-sky",
  rose: "bg-rose/20 text-rose",
};

export default function OwnersPage(): React.ReactElement {
  const ownersList = listOwners(getDb());

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">Owners</h1>
        <p className="text-text-muted">People you can assign tasks to.</p>
      </header>

      <form
        action={createOwnerAction}
        className="rounded-2xl border border-border bg-surface p-4 flex flex-col sm:flex-row gap-3"
      >
        <input
          type="text"
          name="name"
          required
          maxLength={80}
          placeholder="Owner name"
          className="flex-1 bg-surface-2 border border-border rounded-xl px-3 py-2 text-text placeholder:text-text-muted focus:outline-none focus:border-accent"
        />
        <select
          name="color"
          defaultValue="lavender"
          className="bg-surface-2 border border-border rounded-xl px-3 py-2 text-text focus:outline-none focus:border-accent"
        >
          {ownerColors.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-xl bg-accent/20 text-accent border border-accent/40 px-4 py-2 font-medium hover:bg-accent/30 transition-colors"
        >
          Add owner
        </button>
      </form>

      {ownersList.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface/60 p-10 text-center">
          <p className="text-text-muted">No owners yet.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {ownersList.map((owner) => (
            <li
              key={owner.id}
              className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-surface px-5 py-4"
            >
              <div className="flex items-center gap-3">
                <span
                  className={"px-2.5 py-1 rounded-full text-xs font-medium " + colorBadge[owner.color]}
                >
                  {owner.color}
                </span>
                <span className="font-medium text-text">{owner.name}</span>
              </div>
              <form action={deleteOwnerAction}>
                <input type="hidden" name="id" value={owner.id} />
                <button
                  type="submit"
                  aria-label="Delete owner"
                  title="Delete owner"
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
