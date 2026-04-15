import { z } from "zod";
import { ownerColors } from "@/lib/db/schema";

export const ownerColorSchema = z.enum(ownerColors);

export const createOwnerInput = z.object({
  name: z.string().trim().min(1, "name is required").max(80),
  color: ownerColorSchema.optional().default("lavender"),
});

export const ownerDto = z.object({
  id: z.string(),
  name: z.string(),
  color: ownerColorSchema,
});

export type CreateOwnerInput = z.infer<typeof createOwnerInput>;
export type OwnerDto = z.infer<typeof ownerDto>;
