import { asc, eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import * as schema from "@/lib/db/schema";
import { tags, type TagRow } from "@/lib/db/schema";
import type { CreateTagInput, TagDto } from "@/lib/schemas/tag";

type Db = BetterSQLite3Database<typeof schema>;

export class TagNotFoundError extends Error {
  constructor(id: string) {
    super(`tag not found: ${id}`);
    this.name = "TagNotFoundError";
  }
}

export class TagExistsError extends Error {
  constructor(name: string) {
    super(`tag already exists: ${name}`);
    this.name = "TagExistsError";
  }
}

export function listTags(db: Db): TagDto[] {
  return db.select().from(tags).orderBy(asc(tags.name)).all().map(toDto);
}

export function createTag(db: Db, input: CreateTagInput): TagDto {
  const existing = db.select().from(tags).where(eq(tags.name, input.name)).get();
  if (existing) throw new TagExistsError(input.name);
  const row = {
    id: randomUUID(),
    name: input.name,
    createdAt: new Date(),
  };
  db.insert(tags).values(row).run();
  return toDto(row);
}

export function deleteTag(db: Db, id: string): void {
  const result = db.delete(tags).where(eq(tags.id, id)).run();
  if (result.changes === 0) throw new TagNotFoundError(id);
}

function toDto(row: TagRow): TagDto {
  return { id: row.id, name: row.name };
}
