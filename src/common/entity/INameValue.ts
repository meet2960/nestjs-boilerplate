import { z } from 'zod';

export const INameValueObjZodSchema = z.object({
  name: z.string(),
  value: z.string(),
});
export const INameValueArrZodSchema = z.array(INameValueObjZodSchema);

export type INameValueObj = z.infer<typeof INameValueObjZodSchema>;
export type INameValueArr = z.infer<typeof INameValueArrZodSchema>;
