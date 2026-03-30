import {
  type CanActivate,
  type ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { isEmpty } from 'lodash-es';
import {
  type Subjects,
  Action,
  IAbility,
} from '@/modules/helpers/casl/static/casl.types';
import { ABILITY } from '@/decorators/permission.decorator';
import { ContextProvider } from '@/providers';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermission = this.reflector.getAllAndOverride<IAbility[]>(
      ABILITY,
      [context.getHandler(), context.getClass()],
    );

    if (isEmpty(requiredPermission)) {
      return true;
    }

    const ability = ContextProvider.getAbility();
    const hasPagePermission = requiredPermission.every((rp) =>
      ability.can(rp.action as Action, rp.subject as Subjects),
    );

    if (hasPagePermission) {
      return true;
    }

    throw new ForbiddenException('Not Authorized to Perform Operations');
  }
}
