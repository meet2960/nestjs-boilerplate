import { Injectable, type NestMiddleware } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';
import { getCurrentUtcDateTime } from '@/common/utility/date-fns-utils';
import { ContextProvider } from '@/providers';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction): void {
    const requestObj = {
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      requestId: crypto.randomUUID(),
      requestTimestamp: getCurrentUtcDateTime(), // TODO: Add Custom Format for the timestamp
    };

    ContextProvider.setRequestContext({ ...requestObj });
    next();
  }
}
