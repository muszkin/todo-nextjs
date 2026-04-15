import Database from "better-sqlite3";
import { drizzle, type BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import * as schema from "./schema";

const DB_PATH = process.env.DATABASE_URL ?? "./data/app.db";

let _db: BetterSQLite3Database<typeof schema> | null = null;

export function getDb(): BetterSQLite3Database<typeof schema> {
  if (_db) return _db;
  mkdirSync(dirname(DB_PATH), { recursive: true });
  const sqlite = new Database(DB_PATH);
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");
  _db = drizzle(sqlite, { schema });
  runMigrations(sqlite);
  return _db;
}

function runMigrations(sqlite: Database.Database): void {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      due_at INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'todo',
      created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
      updated_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000)
    );
    CREATE INDEX IF NOT EXISTS tasks_due_at_idx ON tasks(due_at);
    CREATE INDEX IF NOT EXISTS tasks_status_idx ON tasks(status);

    CREATE TABLE IF NOT EXISTS owners (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      color TEXT NOT NULL DEFAULT 'lavender',
      created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000)
    );

    CREATE TABLE IF NOT EXISTS task_owners (
      task_id TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
      owner_id TEXT NOT NULL REFERENCES owners(id) ON DELETE CASCADE,
      PRIMARY KEY (task_id, owner_id)
    );
    CREATE INDEX IF NOT EXISTS task_owners_owner_idx ON task_owners(owner_id);
  `);
}

export function createTestDb(): BetterSQLite3Database<typeof schema> {
  const sqlite = new Database(":memory:");
  sqlite.pragma("foreign_keys = ON");
  runMigrations(sqlite);
  return drizzle(sqlite, { schema });
}
