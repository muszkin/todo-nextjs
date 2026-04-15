import { beforeEach, describe, expect, it } from "vitest";
import { createTestDb } from "@/lib/db/client";
import {
  OwnerNotFoundError,
  createOwner,
  deleteOwner,
  listOwners,
} from "@/lib/owners/service";
import { createTask, getTask, listTasks } from "@/lib/tasks/service";

let db: ReturnType<typeof createTestDb>;

beforeEach(() => {
  db = createTestDb();
});

describe("owner service", () => {
  it("creates and lists owners ordered by name", () => {
    createOwner(db, { name: "Zoe", color: "rose" });
    createOwner(db, { name: "Anna", color: "mint" });
    const list = listOwners(db);
    expect(list.map((o) => o.name)).toEqual(["Anna", "Zoe"]);
    expect(list[0].color).toBe("mint");
  });

  it("deletes an owner", () => {
    const o = createOwner(db, { name: "Bob", color: "sky" });
    deleteOwner(db, o.id);
    expect(listOwners(db)).toHaveLength(0);
  });

  it("delete missing owner throws", () => {
    expect(() => deleteOwner(db, "missing")).toThrow(OwnerNotFoundError);
  });
});

describe("task ↔ owner integration", () => {
  it("createTask attaches owners", () => {
    const a = createOwner(db, { name: "Anna", color: "mint" });
    const b = createOwner(db, { name: "Bob", color: "sky" });
    const task = createTask(db, {
      title: "shared",
      dueAt: new Date("2026-05-01T10:00:00Z"),
      ownerIds: [a.id, b.id],
    });
    expect(task.owners).toHaveLength(2);
    const fetched = getTask(db, task.id);
    expect(new Set(fetched.owners.map((o) => o.name))).toEqual(new Set(["Anna", "Bob"]));
  });

  it("listTasks hydrates owners per task", () => {
    const a = createOwner(db, { name: "Anna", color: "mint" });
    createTask(db, {
      title: "with owner",
      dueAt: new Date("2026-05-01T10:00:00Z"),
      ownerIds: [a.id],
    });
    createTask(db, {
      title: "no owner",
      dueAt: new Date("2026-05-02T10:00:00Z"),
      ownerIds: [],
    });
    const tasks = listTasks(db);
    expect(tasks).toHaveLength(2);
    expect(tasks[0].owners).toHaveLength(1);
    expect(tasks[1].owners).toHaveLength(0);
  });

  it("deleting owner cascades to task_owners join, task remains", () => {
    const a = createOwner(db, { name: "Anna", color: "mint" });
    const t = createTask(db, {
      title: "linked",
      dueAt: new Date("2026-05-01T10:00:00Z"),
      ownerIds: [a.id],
    });
    deleteOwner(db, a.id);
    const reloaded = getTask(db, t.id);
    expect(reloaded.owners).toHaveLength(0);
  });
});
