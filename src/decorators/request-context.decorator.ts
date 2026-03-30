import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { IRequestContext } from '@/common/entity/IRequestContext';
import { nanoid } from 'nanoid';
import type { IUserSession } from '@/common/entity/IUserSession';
import { ContextProvider } from '@/providers';

export const RequestContext = createParamDecorator(
  async (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const reqId = ContextProvider.getClsService().getId();

    const sessionUser: IUserSession = request.user;

    const requestContext: IRequestContext = {
      requestObject: request,
      sessionUser: sessionUser,
      apiUid: reqId || nanoid(),
    };

    return requestContext;
    // try {
    //   const foundObject = find(allPathDetail, (value) =>
    //     includes(request.url, get(value, 'controllerName')),
    //   );
    //   if (foundObject)
    //     requestContext.controllerName = get(foundObject, 'i18pageCode', '');
    //   return requestContext;
    // } catch (error) {
    //   return null;
    // }
  },
);
