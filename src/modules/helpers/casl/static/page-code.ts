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
  static readonly change_tpin = 'change_tpin';
  static readonly change_password = 'change_password';

  // * Development Pages
  static readonly local_log = 'local_log';

  // * Application Specific Pages
  static readonly signup_request = 'signup_request';
  static readonly signup_request_audit_trail = 'signup_request_audit_trail';
  static readonly signup_request_docs = 'signup_request_docs';
  static readonly complaint = 'complaint';
  static readonly service = 'service';
  static readonly service_group = 'service_group';
  static readonly user_service = 'user_service';
  static readonly bank_beneficiary = 'bank_beneficiary';
  static readonly wallet = 'wallet';
  static readonly transaction = 'transaction';
  static readonly transaction_metadata = 'transaction_metadata';
  static readonly transaction_refund = 'transaction_refund';
  static readonly wallet_ledger = 'wallet_ledger';
  static readonly user_doc = 'user_doc';
  static readonly user_service_commercial = 'user_service_commercial';
  static readonly user_pg_commercial = 'user_pg_commercial';
  static readonly user_payout_commercial = 'user_payout_commercial';
  static readonly external_service_log = 'external_service_log';

  // * Service Invoker
  static readonly service_invoker = 'service_invoker';
  static readonly service_invoker_dg = 'service_invoker_dg';
  static readonly service_invoker_bx = 'service_invoker_bx';
  static readonly service_invoker_kpip = 'service_invoker_kpip';

  // * External Integrations
  static readonly digi_seva_integration = 'digi_seva_integration';
  static readonly branch_x_integration = 'branch_x_integration';
  static readonly our_instant_pay_integration = 'our_instant_pay_integration';
}

export type PageCodeKey = keyof typeof PageCode;
export type PageCodeValue = (typeof PageCode)[PageCodeKey];
