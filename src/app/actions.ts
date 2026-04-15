"use server";

import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db/client";
import { createOwnerInput } from "@/lib/schemas/owner";
import { createTaskInput, updateTaskInput } from "@/lib/schemas/task";
import { createOwner, deleteOwner } from "@/lib/owners/service";
import { createTask, deleteTask, updateTask } from "@/lib/tasks/service";

export async function createTaskAction(formData: FormData): Promise<void> {
  const input = createTaskInput.parse({
    title: formData.get("title"),
    dueAt: formData.get("dueAt"),
    ownerIds: formData.getAll("ownerIds"),
  });
  createTask(getDb(), input);
  revalidatePath("/");
  revalidatePath("/calendar");
}

export async function setTaskStatusAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id"));
  const status = String(formData.get("status"));
  const input = updateTaskInput.parse({ status });
  updateTask(getDb(), id, input);
  revalidatePath("/");
  revalidatePath("/calendar");
}

export async function deleteTaskAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id"));
  deleteTask(getDb(), id);
  revalidatePath("/");
  revalidatePath("/calendar");
}

export async function createOwnerAction(formData: FormData): Promise<void> {
  const input = createOwnerInput.parse({
    name: formData.get("name"),
    color: formData.get("color") || undefined,
  });
  createOwner(getDb(), input);
  revalidatePath("/owners");
  revalidatePath("/");
}

export async function deleteOwnerAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id"));
  deleteOwner(getDb(), id);
  revalidatePath("/owners");
  revalidatePath("/");
}
