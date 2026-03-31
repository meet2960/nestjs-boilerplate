import z from 'zod';

export const VerifyEmailZodSchema = z.object({
  email: z.email(),
});
export type IVerifyEmail = z.infer<typeof VerifyEmailZodSchema>;

export class VerifyEmailDto implements IVerifyEmail {
  email!: string;
}
