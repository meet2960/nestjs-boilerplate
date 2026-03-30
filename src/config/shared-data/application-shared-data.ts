import { includes, values } from 'lodash';
import { developmentModeObj } from '@/common/static/application-mode/application-mode';

export class ApplicationSharedData {
  public static readonly DateFormat = 'DD/MM/YYYY';
  public static readonly DefaultDateTimeFormatToPrint =
    'YYYY-MM-DD hh:mm:ss.SSS A';
  public static readonly RowPerPage: number[] = [10, 20, 30, 40, 50, 100];

  public static readonly SwaggerDocPath = 'documentation';

  public static readonly env = {
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
  };

  public static readonly isDevelopmentMode = () => {
    const isTrue = includes(values(developmentModeObj), 'dev');
    return isTrue;
  };

  // * Check For Super Users
  public static readonly superUserRoles = ['SUPER_ADMIN', 'ADMIN'];
  public static isSuperUser(role: string): boolean {
    return includes(this.superUserRoles, role);
  }

  public static readonly payoutRates = {
    globalMdrRate: 1.7,
  };

  public static readonly branchXConfig = {
    payoutRate: 1.7,
    payoutCoolDownMinutes: 5,
    baseBalance: 1,
    bankValidationCharges: 4,
    flatCharges: 25,
  };

  public static readonly transactionCoolDownMinutes = 1;
  public static readonly payoutCoolDownMinutes = 1;

  public static getSessionCacheKey(userId: number) {
    return `user:${userId}:session`;
  }
}
