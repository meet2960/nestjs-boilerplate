import { Injectable } from '@nestjs/common';
import type { TranslateOptions } from 'nestjs-i18n';
import { I18nService as I18nServiceBase } from 'nestjs-i18n';
import { ContextProvider } from '@/providers';

@Injectable()
export class I18nService {
  constructor(private readonly i18n: I18nServiceBase) {}

  private currentLang = 'en';

  translate(key: string, options?: TranslateOptions): Promise<string> {
    return this.i18n.translate(key, {
      ...options,
      lang: ContextProvider.getLanguage(),
    });
  }

  t(key: string, options?: TranslateOptions) {
    return this.i18n.t(`${this.currentLang}.${key}`, options);
  }
  //   customTranslate(key: string, options?: TranslateOptions) {
  //     return this.i18n.translate(`${this.currentLang}.${key}`, options);
  //   }
  setLang(lang: 'en') {
    this.currentLang = lang;
  }
}
