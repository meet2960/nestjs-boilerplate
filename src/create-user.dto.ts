import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateUserZodSchema = z.object({
  name: z.string().min(1).max(255).default('').describe('The name of the user'),
  email: z
    .string()
    .min(1)
    .default('example@example.com')
    .describe('The email of the user'),
  password: z
    .string()
    .min(3)
    .max(255)
    .default('')
    .describe('The password of the user'),
});
export class CreateUserDto extends createZodDto(CreateUserZodSchema) {}
