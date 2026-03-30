import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import sh from 'lodash';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getClass());
    if (sh.isEmpty(roles)) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userRoles = request.user?.role as string[];
    const lowerCaseArray = sh.map(roles, sh.toLower);
    const hasRole = lowerCaseArray.some((role) =>
      userRoles.some((userRole) => userRole === (role as string)),
    );
    if (hasRole) {
      return true;
    }
    throw new ForbiddenException('Not Authorized to Perform Operations');
  }
}
