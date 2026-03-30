export class GlobalConfig {
  // * Application Config
  public static readonly APPLICATION_NAME = 'KP App APIs';
  public static readonly API_PREFIX = 'api';
  public static readonly APP_VERSION = '1.0.0';
  public static readonly API_VERSION = 'v1';
  public static readonly API_BASE_URL = `/${GlobalConfig.API_PREFIX}/${GlobalConfig.API_VERSION}`;

  // * Swagger Config
  public static readonly SWAGGER_PATH = 'documentation';

  // * Email Sender Config
  public static readonly EMAIL_SENDER = '';

  // * Pagination Config
  public static readonly MAX_PAGE_SIZE = 10000;
  public static readonly DEFAULT_PAGE_NUMBER = 1;
  public static readonly DEFAULT_PAGE_SIZE = 10;
  public static readonly DEFAULT_SORT_FIELD = 'created_date';
  public static readonly DEFAULT_SORT_ORDER = 'DESC';

  // * Params Encryption/Decryption Config
  public static readonly DECRYPT_PARAMS = false;
  public static readonly ENCRYPT_QUERY_PARAMS = false;

  // * REQ/RES Encryption/Decryption Config
  public static readonly ENCRYPT_RESPONSE_BODY = true;
  public static readonly DECRYPT_PAYLOAD_BODY = true;

  public static readonly GLOBAL_REQ_RES_ENCRYPTION = false;
}
