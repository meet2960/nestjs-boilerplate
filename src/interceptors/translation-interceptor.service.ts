import type { TranslationService } from '@/shared/services/translation.service';
import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';

// TODO: add implementation
@Injectable()
export class TranslationInterceptor implements NestInterceptor {
  constructor(private readonly translationService: TranslationService) {}

  public intercept(_context: ExecutionContext, next: CallHandler) {
    this.translationService.translate('common.hello', {});
    return next.handle();
  }
}
