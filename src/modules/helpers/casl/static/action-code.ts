export class ActionCode {
  // * To Bypass
  static readonly manage = 'manage';

  // * Common One
  static readonly create = 'create';
  static readonly read = 'read';
  static readonly update = 'update';
  static readonly delete = 'delete';
  static readonly list = 'list';

  // * Specific Actions
  static readonly all = 'all';
  static readonly me = 'me';
  static readonly view = 'view';
  static readonly bulk = 'bulk';
  static readonly child_list = 'child_list';
  static readonly download = 'download';
}

export type ActionCodeKey = keyof typeof ActionCode;
export type ActionCodeValue = (typeof ActionCode)[ActionCodeKey];
