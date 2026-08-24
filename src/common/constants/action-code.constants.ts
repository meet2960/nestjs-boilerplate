import { StringKeys } from '@/common/types/common.type';

export class ActionCode {
  // * To Bypass
  static readonly manage = 'manage';

  // * Common One
  static readonly list = 'list';
  static readonly create = 'create';
  static readonly read = 'read';
  static readonly update = 'update';
  static readonly delete = 'delete';

  // * Specific Actions
  static readonly all = 'all';
  static readonly me = 'me';
  static readonly view = 'view';
  static readonly bulk = 'bulk';
  static readonly child_list = 'child_list';
  static readonly download = 'download';
}

export type ActionCodeKey = StringKeys<typeof ActionCode>;
