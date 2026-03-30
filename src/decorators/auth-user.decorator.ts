import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';

export function AuthUser() {
  return createParamDecorator((_data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user?.[Symbol.for('isPublic')]) {
      return;
    }

    return user;

    // const user: any = {
    //   iat: 0,
    //   exp: 0,
    //   user_id: 9,
    //   role_id: 5,
    //   role: '',
    //   user_name: '',
    //   type: '',
    // };
    // if (user?.[Symbol.for('isPublic')]) {
    //   return;
    // }
    // return user;
  })();
}
