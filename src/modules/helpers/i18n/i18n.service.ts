import { Injectable } from '@nestjs/common';
import type { TranslateOptions } from 'nestjs-i18n';
import { I18nService as I18nServiceBase } from 'nestjs-i18n';
import { ContextProvider } from '@/providers';

@Injectable()
export class I18nService {
  constructor(private readonly i18n: I18nServiceBase) {}

  /** Filename of src/i18n/{locale}/*.json (common.json → namespace "common"). */
  private readonly namespace = 'common';
  private currentLang = 'en';

  translate(key: string, options?: TranslateOptions): Promise<string> {
    return this.i18n.translate(this.toNamespacedKey(key), {
      ...options,
      lang: this.resolveLang(options?.lang),
    });
  }

  t(key: string, options?: TranslateOptions) {
    return this.i18n.t(this.toNamespacedKey(key), {
      ...options,
      lang: this.resolveLang(options?.lang),
    });
  }

  setLang(lang: 'en') {
    this.currentLang = lang;
  }

  private toNamespacedKey(key: string): string {
    return key.startsWith(`${this.namespace}.`)
      ? key
      : `${this.namespace}.${key}`;
  }

  private resolveLang(explicit?: string): string {
    const raw = explicit ?? ContextProvider.getLanguage() ?? this.currentLang;
    if (raw.includes('_')) {
      return raw.split('_')[0].toLowerCase();
    }
    return raw;
  }
}
