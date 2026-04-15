import { asc, eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import * as schema from "@/lib/db/schema";
import { tasks, type TaskRow } from "@/lib/db/schema";
import type { CreateTaskInput, TaskDto, UpdateTaskInput } from "@/lib/schemas/task";

type Db = BetterSQLite3Database<typeof schema>;

export class TaskNotFoundError extends Error {
  constructor(id: string) {
    super(`task not found: ${id}`);
    this.name = "TaskNotFoundError";
  }
}

export function listTasks(db: Db): TaskDto[] {
  const rows = db.select().from(tasks).orderBy(asc(tasks.dueAt)).all();
  return rows.map(toDto);
}

export function getTask(db: Db, id: string): TaskDto {
  const row = db.select().from(tasks).where(eq(tasks.id, id)).get();
  if (!row) throw new TaskNotFoundError(id);
  return toDto(row);
}

export function createTask(db: Db, input: CreateTaskInput): TaskDto {
  const now = new Date();
  const row = {
    id: randomUUID(),
    title: input.title,
    dueAt: input.dueAt,
    status: "todo" as const,
    createdAt: now,
    updatedAt: now,
  };
  db.insert(tasks).values(row).run();
  return toDto(row);
}

export function updateTask(db: Db, id: string, input: UpdateTaskInput): TaskDto {
  const existing = db.select().from(tasks).where(eq(tasks.id, id)).get();
  if (!existing) throw new TaskNotFoundError(id);

  const updated = {
    ...existing,
    ...input,
    updatedAt: new Date(),
  };
  db.update(tasks).set(updated).where(eq(tasks.id, id)).run();
  return toDto(updated);
}

export function deleteTask(db: Db, id: string): void {
  const result = db.delete(tasks).where(eq(tasks.id, id)).run();
  if (result.changes === 0) throw new TaskNotFoundError(id);
}

function toDto(row: TaskRow): TaskDto {
  return {
    id: row.id,
    title: row.title,
    dueAt: row.dueAt.toISOString(),
    status: row.status,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}
