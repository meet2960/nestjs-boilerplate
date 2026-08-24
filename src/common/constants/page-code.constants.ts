import { StringKeys } from '../types/common.type';

export class PageCode {
  // * To Bypass
  static readonly all = 'all';
  static readonly guest = 'guest';

  // * Common Pages
  static readonly users = 'users';
  static readonly roles = 'roles';
  static readonly common_list = 'common_list';
  static readonly tenants = 'tenants';
  static readonly user_tenants = 'user_tenants';
  static readonly email_queues = 'email_queues';
  static readonly page = 'page';
  static readonly audit_trails = 'audit_trails';
  static readonly document = 'document';

  // * Dashboards
  static readonly user_dashboard = 'user_dashboard';
  static readonly admin_dashboard = 'admin_dashboard';

  // * Auth Pages
  static readonly change_password = 'change_password';

  // * Development Pages
  static readonly local_log = 'local_log';

  // * Application Specific Pages
  static readonly signup_request = 'signup_request';
  static readonly signup_request_audit_trail = 'signup_request_audit_trail';
  static readonly signup_request_docs = 'signup_request_docs';
  static readonly complaint = 'complaint';
  static readonly external_service_log = 'external_service_log';
}

export type PageCodeKey = StringKeys<typeof PageCode>;
