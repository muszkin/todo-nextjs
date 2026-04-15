import { z } from "zod";

export const createTagInput = z.object({
  name: z
    .string()
    .trim()
    .min(1, "name is required")
    .max(40)
    .regex(/^[a-z0-9][a-z0-9-]*$/, "lowercase letters, digits, hyphens only"),
});

export const tagDto = z.object({
  id: z.string(),
  name: z.string(),
});

export type CreateTagInput = z.infer<typeof createTagInput>;
export type TagDto = z.infer<typeof tagDto>;
