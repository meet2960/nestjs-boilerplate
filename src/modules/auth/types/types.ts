import type { Request } from 'express';
import type { IUserSession } from '@/common/entity/IUserSession';

//TODO: Fix the User Entity and remove the 'any' type from the user property in ICreateLoginHistoryRecord interface
export interface ICreateLoginHistoryRecord {
  request: Request;
  user: any | null;
  extraInfo: {
    event_type: string;
    latitude: string | null;
    longitude: string | null;
    device_type: string | null;
    meta_info: string | null;
  };
}

export type TokenCreationPayload = Pick<
  IUserSession,
  'user_id' | 'role_id' | 'user_name' | 'role_code'
> & {
  session_id: string;
};
