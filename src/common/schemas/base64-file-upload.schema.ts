import { z } from 'zod';

export const Base64FileUploadSchema = z.object({
  file_name: z
    .string()
    .min(5, 'file_name must be at least 5 characters')
    .max(100, 'file_name must be at most 100 characters'),

  file_base64: z.string().min(1, 'file_base64 cannot be empty'),

  file_type: z.string().min(1, 'file_type cannot be empty'),

  file_size: z.number().nullable().optional(),

  file_mime_type: z
    .string()
    .min(1, 'file_mime_type cannot be empty')
    .nullable()
    .optional(),
});
