import type { Request } from 'express';
import type { IUserSession } from './IUserSession';

export interface IRequestContext {
  requestObject: Request;
  apiUid: string;
  sessionUser: IUserSession;
  extraInfo?: Record<string, any>;
}
