import { z } from 'zod';

const latitudeRegex = /^-?(?:[1-8]?\d(?:\.\d+)?|90(?:\.0+)?)$/;
const longitudeRegex = /^-?(?:180(?:\.0+)?|(?:1[0-7]\d|[1-9]?\d)(?:\.\d+)?)$/;

export const UserLoginExtraFieldsZodSchema = z.object({
  latitude: z.string().min(1).max(40).regex(latitudeRegex, 'Invalid latitude'),
  longitude: z
    .string()
    .min(1)
    .max(40)
    .regex(longitudeRegex, 'Invalid longitude'),
  device_type: z.string().min(1).max(50),
});

export const UserLoginZodSchema = z.object({
  email: z.string().min(1).max(100).email(),
  password: z.string().min(1).max(150),
  extra_info: UserLoginExtraFieldsZodSchema,
});

export type IUserLogin = z.infer<typeof UserLoginZodSchema>;
export type UserLoginDto = IUserLogin;
