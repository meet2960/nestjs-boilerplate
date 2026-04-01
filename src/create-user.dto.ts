import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateUserZodSchema = z.object({
  name: z.string().min(1).max(255).default(''),
  email: z.string().email(),
  password: z.string().min(3).max(255).default(''),
});
export class CreateUserDto extends createZodDto(CreateUserZodSchema) {}
