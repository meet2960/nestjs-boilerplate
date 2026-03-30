import { createParamDecorator, type ExecutionContext } from '@nestjs/common';

export const RawBody = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): any => {
    const request = ctx.switchToHttp().getRequest();
    return request.body;
  },
);
