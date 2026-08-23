import type { Request, Response } from 'express';
import type { IUserSession } from './user-session.interface';

export interface IRequestContext {
  requestObject: Request;
  responseObject: Response;
  apiUid: string;
  sessionUser: IUserSession;
  extraInfo?: Record<string, any>;
}
