import { Injectable, type NestMiddleware } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';

@Injectable()
export class IPFilterMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const allowedIPs = new Set([
      '150.241.245.228',
      '3.111.5.910', // instant pay ip
      '98.76.54.32',
      '::1',
      '*',
    ]);

    if (allowedIPs.has('*')) {
      next();
      return;
    }

    const requestIP =
      req?.headers['x-forwarded-for']?.toString()?.split(',')[0]?.trim() ??
      (req.ip as string);

    const isAllowed = allowedIPs.has(requestIP);

    if (!isAllowed) {
      res.status(404).json({ message: 'IP Not Allowed' });
      return;
    }

    next();
  }
}
