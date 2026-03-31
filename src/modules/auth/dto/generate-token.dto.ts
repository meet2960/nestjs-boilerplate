import { z } from 'zod';

export const GenerateTokenSchema = z.object({
  secretKey: z.string().min(1, 'Secret key is required'),
  data: z.record(z.string(), z.unknown()),
  algorithm: z.string().default('HS256'),
});

export type IGenerateToken = z.infer<typeof GenerateTokenSchema>;

export class GenerateTokenDto implements IGenerateToken {
  secretKey!: string;
  data!: Record<string, unknown>;
  algorithm!: string;
}
