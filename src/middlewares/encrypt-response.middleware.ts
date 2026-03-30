import { type Request, type Response, type NextFunction } from 'express';
import { encryptRequest } from '@/common/utility/encryption-utils';

export function EncryptResponseMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const originalJson = res.json;

  res.json = function (body: any) {
    const acceptHeader = req.headers['accept'] || '';
    const contentType = req.headers['content-type'] || '';

    //Only encrypt if request is for JSON
    const shouldEncrypt =
      acceptHeader.includes('application/json') ||
      contentType.includes('application/json');

    try {
      if (shouldEncrypt) {
        const encrypted = encryptRequest(body);
        return originalJson.call(this, { data: encrypted });
      } else {
        return originalJson.call(this, body);
      }
    } catch (e) {
      return originalJson.call(this, body);
    }
  };

  next();
}
