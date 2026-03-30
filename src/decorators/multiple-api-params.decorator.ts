import { ApiParam, type ApiParamOptions } from '@nestjs/swagger';

export function ApplyApiParams(params?: ApiParamOptions[]): MethodDecorator {
  return (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    if (params?.length) {
      for (const param of params) {
        ApiParam(param)(target, propertyKey, descriptor);
      }
    }
  };
}
