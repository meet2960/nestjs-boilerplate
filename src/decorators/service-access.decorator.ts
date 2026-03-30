// service-access.decorator
import { SetMetadata } from '@nestjs/common';

export const SERVICE_ACCESS_KEY = 'service_access';

export interface ServiceAccessMeta {
  serviceCode: string;
  action?: string;
}

export const ServiceAccessDecorator = (serviceCode: string, action?: string) =>
  SetMetadata(SERVICE_ACCESS_KEY, {
    serviceCode,
    action,
  } as ServiceAccessMeta);
