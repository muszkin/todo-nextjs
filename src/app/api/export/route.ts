import { getDb } from "@/lib/db/client";
import { listOwners } from "@/lib/owners/service";
import { listTasks } from "@/lib/tasks/service";

export async function GET(): Promise<Response> {
  const db = getDb();
  const payload = {
    exportedAt: new Date().toISOString(),
    version: 1,
    owners: listOwners(db),
    tasks: listTasks(db),
  };
  const filename = `todo-export-${new Date().toISOString().slice(0, 10)}.json`;
  return new Response(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
