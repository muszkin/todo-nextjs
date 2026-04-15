import { beforeEach, describe, expect, it } from "vitest";
import { createTestDb } from "@/lib/db/client";
import { createOwner } from "@/lib/owners/service";
import { createTask, listTasks, updateTask } from "@/lib/tasks/service";

let db: ReturnType<typeof createTestDb>;

beforeEach(() => {
  db = createTestDb();
});

describe("recurrence", () => {
  it("daily recurring task spawns next task one day later when marked done", () => {
    const due = new Date("2026-05-01T10:00:00Z");
    const t = createTask(db, {
      title: "stand-up",
      dueAt: due,
      recurrence: "daily",
    });
    updateTask(db, t.id, { status: "done" });

    const all = listTasks(db);
    expect(all).toHaveLength(2);
    const next = all.find((x) => x.status === "todo");
    expect(next).toBeDefined();
    const nextDue = new Date(next!.dueAt).toISOString();
    expect(nextDue).toBe("2026-05-02T10:00:00.000Z");
    expect(next!.recurrence).toBe("daily");
    expect(next!.title).toBe("stand-up");
  });

  it("weekly recurring task spawns +7 days", () => {
    const due = new Date("2026-05-01T10:00:00Z");
    const t = createTask(db, { title: "review", dueAt: due, recurrence: "weekly" });
    updateTask(db, t.id, { status: "done" });

    const todos = listTasks(db).filter((x) => x.status === "todo");
    expect(todos).toHaveLength(1);
    expect(new Date(todos[0].dueAt).toISOString()).toBe("2026-05-08T10:00:00.000Z");
  });

  it("non-recurring task does not spawn next on done", () => {
    const t = createTask(db, {
      title: "one-shot",
      dueAt: new Date("2026-05-01T10:00:00Z"),
    });
    updateTask(db, t.id, { status: "done" });
    expect(listTasks(db)).toHaveLength(1);
  });

  it("recurring task with owners copies owners to next instance", () => {
    const anna = createOwner(db, { name: "Anna", color: "mint" });
    const t = createTask(db, {
      title: "with owner",
      dueAt: new Date("2026-05-01T10:00:00Z"),
      recurrence: "daily",
      ownerIds: [anna.id],
    });
    updateTask(db, t.id, { status: "done" });

    const next = listTasks(db).find((x) => x.status === "todo");
    expect(next?.owners).toHaveLength(1);
    expect(next?.owners[0].name).toBe("Anna");
  });

  it("not_do does not spawn next instance", () => {
    const t = createTask(db, {
      title: "skip me",
      dueAt: new Date("2026-05-01T10:00:00Z"),
      recurrence: "daily",
    });
    updateTask(db, t.id, { status: "not_do" });
    expect(listTasks(db)).toHaveLength(1);
  });
});
