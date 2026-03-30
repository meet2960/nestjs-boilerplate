import {
  type CallHandler,
  type ExecutionContext,
  type NestInterceptor,
  Injectable,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { type Request, type Response } from 'express';
import {
  decryptRequest,
  encryptRequest,
} from '@/common/utility/encryption-utils';

@Injectable()
export class EncryptionInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();
    const contentType = req.headers['content-type'] ?? '';
    const requestBody = req.body?.data;
    // Only decrypt for POST, PUT, PATCH
    if (
      ['POST', 'PUT', 'PATCH'].includes(req.method) &&
      contentType.includes('application/json') &&
      typeof requestBody === 'string'
    ) {
      try {
        const decryptedBody = decryptRequest(requestBody);
        req.body = decryptedBody;
      } catch (e) {
        // Do nothing if decrypt fails (e.g., health check)
      }
    } else {
      // No decryption for GET, DELETE, or non-JSON content types
    }

    return next.handle().pipe(
      map((data) => {
        const acceptHeader = req.headers['accept'] || '';
        const isJsonResponse = acceptHeader.includes('application/json');
        if (isJsonResponse) {
          try {
            const encrypted = encryptRequest(data);
            res.setHeader('Content-Type', 'application/json'); // optional
            return { data: encrypted };
          } catch (e) {
            // Encryption failed, return raw
            return data;
          }
        }

        return data;
      }),
    );
  }
}
