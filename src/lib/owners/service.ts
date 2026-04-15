import { asc, eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import * as schema from "@/lib/db/schema";
import { owners, type OwnerRow } from "@/lib/db/schema";
import type { CreateOwnerInput, OwnerDto } from "@/lib/schemas/owner";

type Db = BetterSQLite3Database<typeof schema>;

export class OwnerNotFoundError extends Error {
  constructor(id: string) {
    super(`owner not found: ${id}`);
    this.name = "OwnerNotFoundError";
  }
}

export function listOwners(db: Db): OwnerDto[] {
  return db.select().from(owners).orderBy(asc(owners.name)).all().map(toDto);
}

export function createOwner(db: Db, input: CreateOwnerInput): OwnerDto {
  const row = {
    id: randomUUID(),
    name: input.name,
    color: input.color,
    createdAt: new Date(),
  };
  db.insert(owners).values(row).run();
  return toDto(row);
}

export function deleteOwner(db: Db, id: string): void {
  const result = db.delete(owners).where(eq(owners.id, id)).run();
  if (result.changes === 0) throw new OwnerNotFoundError(id);
}

function toDto(row: OwnerRow): OwnerDto {
  return { id: row.id, name: row.name, color: row.color };
}
