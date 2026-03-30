import { Injectable, type NestMiddleware } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';

@Injectable()
export class OriginFilterMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5000',
      '::1',
      'https://api.cipherwisp.com',
      '*',
    ];

    if (allowedOrigins.includes('*')) {
      next();
      return;
    }

    const origin = req.headers.origin ?? '';
    const referer = req.headers.referer ?? '';

    const isAllowed = allowedOrigins.some(
      (allowed) => origin.startsWith(allowed) || referer.startsWith(allowed),
    );

    if (!isAllowed) {
      res.status(404).json({ message: 'Not Found' });
      return;
    }

    next();
  }
}
