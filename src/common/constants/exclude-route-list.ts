import { RequestMethod } from '@nestjs/common';
import type { RouteInfo } from '@nestjs/common/interfaces';

export const excludeRoutesFromMiddleware: RouteInfo[] = [
  {
    path: '/integrations/branch-x/webhook/payout-transaction',
    method: RequestMethod.GET,
  },
  {
    path: '/integrations/instant-pay/webhook/transaction-update',
    method: RequestMethod.GET,
  },
];
