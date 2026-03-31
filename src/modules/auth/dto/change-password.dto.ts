import { z } from 'zod';

export const ChangePasswordZodSchema = z.object({
  current_password: z.string().min(1).max(100),
  new_password: z.string().min(1).max(100),
  cnf_new_password: z.string().min(1).max(100),
});

export type IChangePassword = z.infer<typeof ChangePasswordZodSchema>;

export class ChangePasswordDto implements IChangePassword {
  current_password!: string;
  new_password!: string;
  cnf_new_password!: string;
}
