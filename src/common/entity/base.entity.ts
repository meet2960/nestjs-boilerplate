import { z } from 'zod';

export const BaseEntitySchema = z.object({
  created_by: z.number().int().nullable().optional(),
  created_date: z.coerce.date(),
  modified_by: z.number().int().nullable().optional(),
  modified_date: z.coerce.date().nullable().optional(),
});

export type BaseEntity = z.infer<typeof BaseEntitySchema>;
