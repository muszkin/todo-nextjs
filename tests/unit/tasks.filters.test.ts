import { beforeEach, describe, expect, it } from "vitest";
import { createTestDb } from "@/lib/db/client";
import { createOwner } from "@/lib/owners/service";
import { createTask, listTasksFiltered, updateTask } from "@/lib/tasks/service";

let db: ReturnType<typeof createTestDb>;

beforeEach(() => {
  db = createTestDb();
});

describe("listTasksFiltered", () => {
  it("filters by status", () => {
    const t1 = createTask(db, {
      title: "a",
      dueAt: new Date("2026-05-01T10:00:00Z"),
      ownerIds: [],
    });
    createTask(db, { title: "b", dueAt: new Date("2026-05-02T10:00:00Z"), ownerIds: [] });
    updateTask(db, t1.id, { status: "done" });

    const todos = listTasksFiltered(db, { status: "todo" });
    expect(todos.map((t) => t.title)).toEqual(["b"]);

    const dones = listTasksFiltered(db, { status: "done" });
    expect(dones.map((t) => t.title)).toEqual(["a"]);
  });

  it("filters by ownerId", () => {
    const anna = createOwner(db, { name: "Anna", color: "mint" });
    const bob = createOwner(db, { name: "Bob", color: "sky" });
    createTask(db, {
      title: "for anna",
      dueAt: new Date("2026-05-01T10:00:00Z"),
      ownerIds: [anna.id],
    });
    createTask(db, {
      title: "for bob",
      dueAt: new Date("2026-05-02T10:00:00Z"),
      ownerIds: [bob.id],
    });
    createTask(db, { title: "orphan", dueAt: new Date("2026-05-03T10:00:00Z"), ownerIds: [] });

    const annaTasks = listTasksFiltered(db, { ownerId: anna.id });
    expect(annaTasks.map((t) => t.title)).toEqual(["for anna"]);
  });

  it("combines status and date range", () => {
    const t = createTask(db, {
      title: "in range",
      dueAt: new Date("2026-05-15T10:00:00Z"),
      ownerIds: [],
    });
    createTask(db, {
      title: "out of range",
      dueAt: new Date("2026-06-01T10:00:00Z"),
      ownerIds: [],
    });
    updateTask(db, t.id, { status: "done" });

    const result = listTasksFiltered(db, {
      status: "done",
      from: new Date("2026-05-01T00:00:00Z"),
      until: new Date("2026-06-01T00:00:00Z"),
    });
    expect(result.map((t) => t.title)).toEqual(["in range"]);
  });

  it("returns all tasks when no filter applied", () => {
    createTask(db, { title: "a", dueAt: new Date("2026-05-01T10:00:00Z"), ownerIds: [] });
    createTask(db, { title: "b", dueAt: new Date("2026-05-02T10:00:00Z"), ownerIds: [] });
    expect(listTasksFiltered(db, {})).toHaveLength(2);
  });
});
