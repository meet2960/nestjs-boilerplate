import type { Request } from 'express';
import type { IUserSession } from './user-session.interface';

export interface IRequestContext {
  requestObject: Request;
  apiUid: string;
  sessionUser: IUserSession;
  extraInfo?: Record<string, any>;
}
