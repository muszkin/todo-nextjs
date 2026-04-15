import { ZodError } from "zod";
import { getDb } from "@/lib/db/client";
import { createTaskInput } from "@/lib/schemas/task";
import { createTask, listTasks } from "@/lib/tasks/service";

export async function GET(): Promise<Response> {
  const db = getDb();
  const items = listTasks(db);
  return Response.json({ items });
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const input = createTaskInput.parse(body);
    const db = getDb();
    const task = createTask(db, input);
    return Response.json(task, { status: 201 });
  } catch (err) {
    if (err instanceof ZodError) {
      return Response.json({ error: "validation_error", issues: err.issues }, { status: 400 });
    }
    if (err instanceof SyntaxError) {
      return Response.json({ error: "invalid_json" }, { status: 400 });
    }
    throw err;
  }
}
