import { Injectable, type NestMiddleware } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';
import { ApplicationSharedData } from '@/config/shared-data/application-shared-data';
import { getCurrentDateTimeFromMoment } from '@/common/utility/moment-utils';
import { ContextProvider } from '@/providers';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction): void {
    const requestObj = {
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      requestId: crypto.randomUUID(),
      requestTimestamp: getCurrentDateTimeFromMoment(
        ApplicationSharedData.DefaultDateTimeFormatToPrint,
      ),
    };

    ContextProvider.setRequestContext({ ...requestObj });
    next();
  }
}
