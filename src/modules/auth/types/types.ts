import type { Request } from 'express';
import type { UserEntity } from '@/modules/api/users/entities/user.entity';
import type { IUserSession } from '@/common/entity/IUserSession';

export interface ICreateLoginHistoryRecord {
  request: Request;
  user: UserEntity | null;
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
