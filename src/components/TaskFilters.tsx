import Link from "next/link";
import type { OwnerDto } from "@/lib/schemas/owner";
import type { TagDto } from "@/lib/schemas/tag";
import type { TaskDto } from "@/lib/schemas/task";

export type TaskFilter = {
  status?: TaskDto["status"];
  ownerId?: string;
  tagId?: string;
};

export function TaskFilters({
  current,
  owners,
  tags,
}: {
  current: TaskFilter;
  owners: OwnerDto[];
  tags: TagDto[];
}): React.ReactElement {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <FilterChip label="all" href={buildHref({})} active={!current.status && !current.ownerId && !current.tagId} />
      <FilterChip label="todo" href={buildHref({ ...current, status: "todo" })} active={current.status === "todo"} />
      <FilterChip label="done" href={buildHref({ ...current, status: "done" })} active={current.status === "done"} />
      <FilterChip label="not-do" href={buildHref({ ...current, status: "not_do" })} active={current.status === "not_do"} />

      {owners.length > 0 && <span className="mx-1 text-border">|</span>}
      {owners.map((owner) => (
        <FilterChip
          key={owner.id}
          label={owner.name}
          href={buildHref({ ...current, ownerId: owner.id, tagId: undefined })}
          active={current.ownerId === owner.id}
        />
      ))}

      {tags.length > 0 && <span className="mx-1 text-border">|</span>}
      {tags.map((tag) => (
        <FilterChip
          key={tag.id}
          label={`#${tag.name}`}
          href={buildHref({ ...current, tagId: tag.id, ownerId: undefined })}
          active={current.tagId === tag.id}
        />
      ))}
    </div>
  );
}

function FilterChip({
  label,
  href,
  active,
}: {
  label: string;
  href: string;
  active: boolean;
}): React.ReactElement {
  return (
    <Link
      href={href}
      className={
        "px-3 py-1.5 rounded-full text-xs border transition-colors " +
        (active
          ? "bg-accent/20 text-accent border-accent/40"
          : "border-border text-text-muted hover:text-text hover:border-accent/60")
      }
    >
      {label}
    </Link>
  );
}

function buildHref(filter: TaskFilter): string {
  const params = new URLSearchParams();
  if (filter.status) params.set("status", filter.status);
  if (filter.ownerId) params.set("owner", filter.ownerId);
  if (filter.tagId) params.set("tag", filter.tagId);
  const qs = params.toString();
  return qs ? `/?${qs}` : "/";
}
