import {
  Injectable,
  InternalServerErrorException,
  type NestMiddleware,
} from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { ContextProvider } from '@/providers';

@Injectable()
export class IdempotencyMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    try {
      const key = this.extractKey(req);

      if (!key || key.trim() === '') {
        throw new InternalServerErrorException('Key is missing in request');
      }

      ContextProvider.setIdempotencyKey(key ?? '');
      (req as any).idempotencyKey = key ?? null;
      return next();
    } catch (err) {
      throw err;
    }
  }

  private extractKey(req: Request): string | null {
    // Prefer header (case-insensitive)
    const headerNames = [
      'Idempotency-Key',
      'idempotency-key',
      'idempotency_key',
    ];
    for (const h of headerNames) {
      const v = req.header(h);
      if (typeof v === 'string' && v.trim()) return v.trim();
    }

    // Query params
    // const qNames = ['idempotencyKey', 'idempotency_key', 'idempotency-key'];
    // for (const q of qNames) {
    //   const val = (req.query as any)[q];
    //   if (typeof val === 'string' && val.trim()) return val.trim();
    // }

    // Body field (requires body-parser to have run earlier)
    // if (req.body && typeof req.body === 'object') {
    //   for (const b of qNames) {
    //     const bv = (req.body as any)[b];
    //     if (typeof bv === 'string' && bv.trim()) return bv.trim();
    //   }
    // }

    return null;
  }
}
