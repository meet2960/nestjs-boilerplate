import { Injectable } from '@nestjs/common';
import type { TranslateOptions } from 'nestjs-i18n';
import { I18nService } from 'nestjs-i18n';
import { ContextProvider } from '@/providers';

@Injectable()
export class TranslationService {
  constructor(private readonly i18n: I18nService) {}

  translate(key: string, options?: TranslateOptions): Promise<string> {
    return this.i18n.translate(key, {
      ...options,
      lang: ContextProvider.getLanguage(),
    });
  }
}
