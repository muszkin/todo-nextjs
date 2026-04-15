import { ZodError } from "zod";
import { getDb } from "@/lib/db/client";
import { updateTaskInput } from "@/lib/schemas/task";
import { TaskNotFoundError, deleteTask, getTask, updateTask } from "@/lib/tasks/service";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx): Promise<Response> {
  const { id } = await params;
  try {
    const db = getDb();
    return Response.json(getTask(db, id));
  } catch (err) {
    return errorResponse(err);
  }
}

export async function PATCH(request: Request, { params }: Ctx): Promise<Response> {
  const { id } = await params;
  try {
    const body = await request.json();
    const input = updateTaskInput.parse(body);
    const db = getDb();
    const task = updateTask(db, id, input);
    return Response.json(task);
  } catch (err) {
    return errorResponse(err);
  }
}

export async function DELETE(_req: Request, { params }: Ctx): Promise<Response> {
  const { id } = await params;
  try {
    const db = getDb();
    deleteTask(db, id);
    return new Response(null, { status: 204 });
  } catch (err) {
    return errorResponse(err);
  }
}

function errorResponse(err: unknown): Response {
  if (err instanceof TaskNotFoundError) {
    return Response.json({ error: "not_found" }, { status: 404 });
  }
  if (err instanceof ZodError) {
    return Response.json({ error: "validation_error", issues: err.issues }, { status: 400 });
  }
  if (err instanceof SyntaxError) {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }
  throw err;
}
