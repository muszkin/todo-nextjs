import { beforeEach, describe, expect, it } from "vitest";
import { createTestDb } from "@/lib/db/client";
import {
  TagExistsError,
  TagNotFoundError,
  createTag,
  deleteTag,
  listTags,
} from "@/lib/tags/service";
import { createTask, getTask, listTasksFiltered } from "@/lib/tasks/service";

let db: ReturnType<typeof createTestDb>;

beforeEach(() => {
  db = createTestDb();
});

describe("tag service", () => {
  it("creates and lists tags alphabetically", () => {
    createTag(db, { name: "work" });
    createTag(db, { name: "personal" });
    expect(listTags(db).map((t) => t.name)).toEqual(["personal", "work"]);
  });

  it("rejects duplicate tag names", () => {
    createTag(db, { name: "work" });
    expect(() => createTag(db, { name: "work" })).toThrow(TagExistsError);
  });

  it("delete missing tag throws", () => {
    expect(() => deleteTag(db, "missing")).toThrow(TagNotFoundError);
  });
});

describe("task ↔ tag integration", () => {
  it("createTask attaches tags and hydrate returns them", () => {
    const a = createTag(db, { name: "work" });
    const b = createTag(db, { name: "urgent" });
    const task = createTask(db, {
      title: "ship",
      dueAt: new Date("2026-05-01T10:00:00Z"),
      tagIds: [a.id, b.id],
    });
    expect(task.tags).toHaveLength(2);
    const fetched = getTask(db, task.id);
    expect(new Set(fetched.tags.map((t) => t.name))).toEqual(new Set(["work", "urgent"]));
  });

  it("deleting tag cascades to task_tags join, task remains", () => {
    const a = createTag(db, { name: "work" });
    const t = createTask(db, {
      title: "linked",
      dueAt: new Date("2026-05-01T10:00:00Z"),
      tagIds: [a.id],
    });
    deleteTag(db, a.id);
    const reloaded = getTask(db, t.id);
    expect(reloaded.tags).toHaveLength(0);
  });

  it("filters tasks by tagId", () => {
    const a = createTag(db, { name: "work" });
    createTask(db, {
      title: "tagged",
      dueAt: new Date("2026-05-01T10:00:00Z"),
      tagIds: [a.id],
    });
    createTask(db, {
      title: "untagged",
      dueAt: new Date("2026-05-02T10:00:00Z"),
      tagIds: [],
    });
    const filtered = listTasksFiltered(db, { tagId: a.id });
    expect(filtered.map((t) => t.title)).toEqual(["tagged"]);
  });
});
