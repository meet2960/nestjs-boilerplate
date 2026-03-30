export interface IUserSession {
  iat: number;
  exp: number;
  user_id: number;
  role_code: string;
  role_id: number;
  user_name: string;
  //   type: string;
}

// import { z } from 'zod';
// import {
//   adminUserDefaultValue,
//   IAdminUserZod,
// } from '@/modules/api/admin/user/entities/user.entity';
// export interface IUserSession extends IUserData {}

// export interface IUserData {
//   userInfo: IUserInfo;
//   roles: IRole[];
//   pagePermissions: IPagePermission[];
//   secureToken: string;
// }
// export interface IPagePermission {
//   page_code: string;
//   permission_list: string[];
// }
// export interface IRole {
//   role_name: string;
//   role_code: string;
//   role_id: number;
// }

// const IUserInfoZod = z
//   .object({
//     iat: z.number(),
//     exp: z.number(),
//     //
//     tenant_client_id: z.number(),
//     tenant_name: z.string(),
//     tenant_id: z.number(),
//     is_super_user: z.boolean(),
//   })
//   .merge(IAdminUserZod);

// export type IUserInfo = z.infer<typeof IUserInfoZod>;
// export const userSessionDefaultValue: IUserSession = {
//   userInfo: {
//     ...adminUserDefaultValue,
//     exp: 0,
//     iat: 0,
//     is_super_user: false,
//     tenant_client_id: 0,
//     tenant_name: '',
//     tenant_id: 0,
//   },
//   roles: [],
//   pagePermissions: [],
//   secureToken: '',
// };

// export const IJwtTokenDataZod = IAdminUserZod.pick({
//   user_name: true,
//   user_id: true,
//   client_id: true,
//   role_id: true,
// });
// export type IJwtTokenData = z.infer<typeof IJwtTokenDataZod>;
