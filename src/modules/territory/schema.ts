import { z } from "zod";

const registrySchema = z.object({
  assignedTo: z.string(),
  dateAssigned: z.coerce.date().transform((s) => new Date(s)),
  dateCompleted: z.coerce
    .date()
    .transform((s) => new Date(s))
    .optional(),
});

const territorySchema = z.object({
  number: z.number().int(),
  lastDateCompleted: z.coerce.date().transform((s) => new Date(s)),
  registries: registrySchema.array().min(1).max(4),
});

export const territoryRegistrySchema = z.object({
  serviceYear: z.number().int(),
  territories: territorySchema.array(),
});

export type Registry = z.infer<typeof territoryRegistrySchema>;
