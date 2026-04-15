"use server";

import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db/client";
import { createTaskInput, updateTaskInput } from "@/lib/schemas/task";
import { createTask, deleteTask, updateTask } from "@/lib/tasks/service";

export async function createTaskAction(formData: FormData): Promise<void> {
  const input = createTaskInput.parse({
    title: formData.get("title"),
    dueAt: formData.get("dueAt"),
  });
  createTask(getDb(), input);
  revalidatePath("/");
}

export async function setTaskStatusAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id"));
  const status = String(formData.get("status"));
  const input = updateTaskInput.parse({ status });
  updateTask(getDb(), id, input);
  revalidatePath("/");
}

export async function deleteTaskAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id"));
  deleteTask(getDb(), id);
  revalidatePath("/");
}
