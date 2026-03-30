import { ClsService, ClsServiceManager } from 'nestjs-cls';
import type { AppAbility } from '@/modules/helpers/casl/static/casl.types';
import type { LanguageCode } from '@/common/constants';
import type { IUserSession } from '@/common/entity/IUserSession';

export class ContextProvider {
  private static readonly nameSpace = 'request';
  private static readonly authUserKey = 'user_key';
  private static readonly languageKey = 'language_key';
  private static readonly requestContext = 'requestContext';
  private static readonly ability = 'ability';
  private static readonly userInfo = 'user_info';
  private static readonly idpKey = 'idempotency_key';

  private static get<T>(key: string) {
    const store = ClsServiceManager.getClsService();

    return store.get<T>(ContextProvider.getKeyWithNamespace(key));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static set(key: string, value: any): void {
    const store = ClsServiceManager.getClsService();

    store.set(ContextProvider.getKeyWithNamespace(key), value);
  }

  static getClsService(): ClsService {
    return ClsServiceManager.getClsService();
  }

  private static getKeyWithNamespace(key: string): string {
    return `${ContextProvider.nameSpace}.${key}`;
  }

  // * Set Values Methods
  static setAuthUser(user: IUserSession): void {
    ContextProvider.set(ContextProvider.authUserKey, user);
  }

  static setLanguage(language: string): void {
    ContextProvider.set(ContextProvider.languageKey, language);
  }

  static setRequestContext(data: any): void {
    ContextProvider.set(ContextProvider.requestContext, data);
  }

  static setAbility(ability: AppAbility): void {
    ContextProvider.set(ContextProvider.ability, ability);
  }

  static setUserInfo(data: any): void {
    ContextProvider.set(ContextProvider.userInfo, data);
  }

  static setIdempotencyKey(key: string): void {
    ContextProvider.set(ContextProvider.idpKey, key);
  }

  // * Get Values Methods

  static getLanguage(): LanguageCode | undefined {
    return ContextProvider.get<LanguageCode>(ContextProvider.languageKey);
  }

  static getIdempotencyKey(): string | undefined {
    return ContextProvider.get<string>(ContextProvider.idpKey);
  }

  static getAuthUser(): IUserSession {
    return ContextProvider.get<IUserSession>(ContextProvider.authUserKey);
  }

  static getRequestContext(): Record<string, unknown> {
    return ContextProvider.get(ContextProvider.requestContext);
  }

  static getAbility() {
    return ContextProvider.get<AppAbility>(ContextProvider.ability);
  }

  static getUserInfo() {
    return ContextProvider.get<any>(ContextProvider.userInfo);
  }
}
