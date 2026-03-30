import { applyDecorators, UseGuards, UseInterceptors } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthUserInterceptor } from '../interceptors/auth-user-interceptor.service';
import { PermissionGuard } from '@/guards/permission.guard';
import { type RoleType } from '../common/constants';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { PublicRoute } from './public-route.decorator';
import { Roles } from './roles.decorator';

export function AuthDecorator(
  roles: RoleType[] = [],
  options?: Partial<{ public: boolean }>,
): ClassDecorator {
  //   const isPublicRoute = true;
  const isPublicRoute = options?.public ?? false;

  return applyDecorators(
    Roles(roles),
    UseGuards(
      AuthGuard({ public: isPublicRoute }),
      RolesGuard,
      PermissionGuard,
    ),
    UseInterceptors(AuthUserInterceptor),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
      schema: {
        properties: {
          data: {
            default: null,
          },
          status: {
            default: 'Unauthorized',
          },
          statusCode: {
            default: 401,
          },
          message: {
            default: 'Unauthorized',
          },
        },
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal Server Error',
      schema: {
        properties: {
          data: {
            default: null,
          },
          status: {
            default: 'Internal Server Error',
          },
          statusCode: {
            default: 500,
          },
          message: {
            default: 'There was an error processing your request',
          },
        },
      },
    }),
    PublicRoute(isPublicRoute),
  );
}
