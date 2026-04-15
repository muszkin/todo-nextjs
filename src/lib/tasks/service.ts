import { and, asc, eq, gte, inArray, lt } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import * as schema from "@/lib/db/schema";
import { owners, taskOwners, tasks, type OwnerRow, type TaskRow } from "@/lib/db/schema";
import type { OwnerDto } from "@/lib/schemas/owner";
import type { TaskDto, UpdateTaskInput } from "@/lib/schemas/task";
import type { RecurrenceKind } from "@/lib/db/schema";

type CreateTaskInput = {
  title: string;
  dueAt: Date;
  ownerIds?: string[];
  recurrence?: RecurrenceKind;
};

type Db = BetterSQLite3Database<typeof schema>;

export class TaskNotFoundError extends Error {
  constructor(id: string) {
    super(`task not found: ${id}`);
    this.name = "TaskNotFoundError";
  }
}

export function listTasks(db: Db): TaskDto[] {
  const rows = db.select().from(tasks).orderBy(asc(tasks.dueAt)).all();
  return hydrate(db, rows);
}

export function listTasksFiltered(
  db: Db,
  filter: { status?: TaskDto["status"]; ownerId?: string; from?: Date; until?: Date },
): TaskDto[] {
  const conds = [];
  if (filter.status) conds.push(eq(tasks.status, filter.status));
  if (filter.from) conds.push(gte(tasks.dueAt, filter.from));
  if (filter.until) conds.push(lt(tasks.dueAt, filter.until));

  let rows: TaskRow[];
  if (filter.ownerId) {
    rows = db
      .select({
        id: tasks.id,
        title: tasks.title,
        dueAt: tasks.dueAt,
        status: tasks.status,
        recurrence: tasks.recurrence,
        createdAt: tasks.createdAt,
        updatedAt: tasks.updatedAt,
      })
      .from(tasks)
      .innerJoin(taskOwners, eq(taskOwners.taskId, tasks.id))
      .where(and(eq(taskOwners.ownerId, filter.ownerId), ...conds))
      .orderBy(asc(tasks.dueAt))
      .all();
  } else {
    rows = db
      .select()
      .from(tasks)
      .where(conds.length > 0 ? and(...conds) : undefined)
      .orderBy(asc(tasks.dueAt))
      .all();
  }
  return hydrate(db, rows);
}

export function listTasksInRange(db: Db, from: Date, until: Date): TaskDto[] {
  const rows = db
    .select()
    .from(tasks)
    .where(and(gte(tasks.dueAt, from), lt(tasks.dueAt, until)))
    .orderBy(asc(tasks.dueAt))
    .all();
  return hydrate(db, rows);
}

export function getTask(db: Db, id: string): TaskDto {
  const row = db.select().from(tasks).where(eq(tasks.id, id)).get();
  if (!row) throw new TaskNotFoundError(id);
  const [hydrated] = hydrate(db, [row]);
  return hydrated;
}

export function createTask(db: Db, input: CreateTaskInput): TaskDto {
  const now = new Date();
  const ownerIds = input.ownerIds ?? [];
  const row = {
    id: randomUUID(),
    title: input.title,
    dueAt: input.dueAt,
    status: "todo" as const,
    recurrence: input.recurrence ?? ("none" as const),
    createdAt: now,
    updatedAt: now,
  };
  db.insert(tasks).values(row).run();
  if (ownerIds.length > 0) {
    db.insert(taskOwners)
      .values(ownerIds.map((ownerId) => ({ taskId: row.id, ownerId })))
      .run();
  }
  return getTask(db, row.id);
}

export function updateTask(db: Db, id: string, input: UpdateTaskInput): TaskDto {
  const existing = db.select().from(tasks).where(eq(tasks.id, id)).get();
  if (!existing) throw new TaskNotFoundError(id);

  const { ownerIds, ...rest } = input;
  if (Object.keys(rest).length > 0) {
    db.update(tasks)
      .set({ ...rest, updatedAt: new Date() })
      .where(eq(tasks.id, id))
      .run();
  }

  if (ownerIds !== undefined) {
    db.delete(taskOwners).where(eq(taskOwners.taskId, id)).run();
    if (ownerIds.length > 0) {
      db.insert(taskOwners)
        .values(ownerIds.map((ownerId) => ({ taskId: id, ownerId })))
        .run();
    }
  }

  if (input.status === "done" && existing.recurrence !== "none") {
    spawnRecurrence(db, existing, ownerIds);
  }

  return getTask(db, id);
}

function spawnRecurrence(db: Db, parent: TaskRow, ownerIds: string[] | undefined): void {
  const nextDue = new Date(parent.dueAt);
  if (parent.recurrence === "daily") nextDue.setDate(nextDue.getDate() + 1);
  else if (parent.recurrence === "weekly") nextDue.setDate(nextDue.getDate() + 7);

  const newId = randomUUID();
  const now = new Date();
  db.insert(tasks)
    .values({
      id: newId,
      title: parent.title,
      dueAt: nextDue,
      status: "todo",
      recurrence: parent.recurrence,
      createdAt: now,
      updatedAt: now,
    })
    .run();

  const ownersToCopy =
    ownerIds ??
    db
      .select({ ownerId: taskOwners.ownerId })
      .from(taskOwners)
      .where(eq(taskOwners.taskId, parent.id))
      .all()
      .map((r) => r.ownerId);

  if (ownersToCopy.length > 0) {
    db.insert(taskOwners)
      .values(ownersToCopy.map((ownerId) => ({ taskId: newId, ownerId })))
      .run();
  }
}

export function deleteTask(db: Db, id: string): void {
  const result = db.delete(tasks).where(eq(tasks.id, id)).run();
  if (result.changes === 0) throw new TaskNotFoundError(id);
}

function hydrate(db: Db, rows: TaskRow[]): TaskDto[] {
  if (rows.length === 0) return [];
  const ids = rows.map((r) => r.id);
  const joins = db
    .select({ taskId: taskOwners.taskId, owner: owners })
    .from(taskOwners)
    .innerJoin(owners, eq(taskOwners.ownerId, owners.id))
    .where(inArray(taskOwners.taskId, ids))
    .all();

  const byTask = new Map<string, OwnerDto[]>();
  for (const j of joins) {
    const arr = byTask.get(j.taskId) ?? [];
    arr.push(toOwnerDto(j.owner));
    byTask.set(j.taskId, arr);
  }
  return rows.map((r) => ({ ...toTaskDto(r), owners: byTask.get(r.id) ?? [] }));
}

function toTaskDto(row: TaskRow): Omit<TaskDto, "owners"> {
  return {
    id: row.id,
    title: row.title,
    dueAt: row.dueAt.toISOString(),
    status: row.status,
    recurrence: row.recurrence,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function toOwnerDto(row: OwnerRow): OwnerDto {
  return { id: row.id, name: row.name, color: row.color };
}
