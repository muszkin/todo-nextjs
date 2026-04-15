import { beforeEach, describe, expect, it } from "vitest";
import { createTestDb } from "@/lib/db/client";
import {
  TaskNotFoundError,
  createTask,
  deleteTask,
  getTask,
  listTasks,
  updateTask,
} from "@/lib/tasks/service";

let db: ReturnType<typeof createTestDb>;

beforeEach(() => {
  db = createTestDb();
});

describe("task service", () => {
  it("creates and lists tasks ordered by dueAt ASC", () => {
    const later = new Date("2026-05-01T10:00:00Z");
    const earlier = new Date("2026-04-20T08:00:00Z");
    createTask(db, { title: "later", dueAt: later, ownerIds: [] });
    createTask(db, { title: "earlier", dueAt: earlier, ownerIds: [] });

    const items = listTasks(db);
    expect(items).toHaveLength(2);
    expect(items[0].title).toBe("earlier");
    expect(items[1].title).toBe("later");
    expect(items[0].status).toBe("todo");
  });

  it("getTask returns created task", () => {
    const created = createTask(db, {
      title: "buy milk",
      dueAt: new Date("2026-04-20T12:00:00Z"),
      ownerIds: [],
    });
    const fetched = getTask(db, created.id);
    expect(fetched.title).toBe("buy milk");
    expect(fetched.id).toBe(created.id);
  });

  it("getTask throws TaskNotFoundError for unknown id", () => {
    expect(() => getTask(db, "missing-id")).toThrow(TaskNotFoundError);
  });

  it("updateTask can change status to done and not_do", () => {
    const t = createTask(db, {
      title: "refactor",
      dueAt: new Date("2026-04-25T10:00:00Z"),
      ownerIds: [],
    });
    const done = updateTask(db, t.id, { status: "done" });
    expect(done.status).toBe("done");

    const notDo = updateTask(db, t.id, { status: "not_do" });
    expect(notDo.status).toBe("not_do");
  });

  it("updateTask updates title and dueAt", () => {
    const t = createTask(db, {
      title: "old",
      dueAt: new Date("2026-04-25T10:00:00Z"),
      ownerIds: [],
    });
    const newDue = new Date("2026-04-30T15:00:00Z");
    const updated = updateTask(db, t.id, { title: "new", dueAt: newDue });
    expect(updated.title).toBe("new");
    expect(updated.dueAt).toBe(newDue.toISOString());
  });

  it("updateTask throws for unknown id", () => {
    expect(() => updateTask(db, "missing", { status: "done" })).toThrow(TaskNotFoundError);
  });

  it("deleteTask removes the row", () => {
    const t = createTask(db, {
      title: "gone",
      dueAt: new Date("2026-04-25T10:00:00Z"),
      ownerIds: [],
    });
    deleteTask(db, t.id);
    expect(listTasks(db)).toHaveLength(0);
    expect(() => getTask(db, t.id)).toThrow(TaskNotFoundError);
  });

  it("deleteTask throws for unknown id", () => {
    expect(() => deleteTask(db, "missing")).toThrow(TaskNotFoundError);
  });
});
