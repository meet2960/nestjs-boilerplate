export interface IJwtPayload {
  userId: number;
  email: string;
  role: string;
  pagePermissions: IPagePermissions[];
  type: string;
  iat: number;
  exp: number;
}

export interface IPagePermissions {
  page_code: string;
  action_list: string[];
}
