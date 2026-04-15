import { z } from "zod";
import { recurrenceKinds, taskStatus } from "@/lib/db/schema";
import { ownerDto } from "@/lib/schemas/owner";

export const taskStatusSchema = z.enum(taskStatus);
export const recurrenceSchema = z.enum(recurrenceKinds);

export const createTaskInput = z.object({
  title: z.string().trim().min(1, "title is required").max(500),
  dueAt: z.coerce.date(),
  ownerIds: z.array(z.string()).optional().default([]),
  recurrence: recurrenceSchema.optional().default("none"),
});

export const updateTaskInput = z
  .object({
    title: z.string().trim().min(1).max(500).optional(),
    dueAt: z.coerce.date().optional(),
    status: taskStatusSchema.optional(),
    ownerIds: z.array(z.string()).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "at least one field must be provided",
  });

export const taskDto = z.object({
  id: z.string(),
  title: z.string(),
  dueAt: z.string(),
  status: taskStatusSchema,
  recurrence: recurrenceSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
  owners: z.array(ownerDto),
});

export type CreateTaskInput = z.infer<typeof createTaskInput>;
export type UpdateTaskInput = z.infer<typeof updateTaskInput>;
export type TaskDto = z.infer<typeof taskDto>;
