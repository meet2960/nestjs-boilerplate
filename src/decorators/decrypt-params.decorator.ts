import { urlParamsDecrypt } from '@/common/utility/url-functions';
import { GlobalConfig } from '@/config/global/global-config';
import {
  BadRequestException,
  createParamDecorator,
  type ExecutionContext,
} from '@nestjs/common';

export const DecryptedParam = createParamDecorator(
  (
    options: {
      keyName: string;
      decrypt?: boolean;
    },
    ctx: ExecutionContext,
  ) => {
    const shouldDecrypt = options?.decrypt ?? GlobalConfig.DECRYPT_PARAMS; // Default to GlobalConfig if not provided

    const request = ctx.switchToHttp().getRequest();
    const value = request.params[options.keyName];

    if (!value) {
      throw new BadRequestException(`Missing Route Param`);
    }

    if (shouldDecrypt) {
      const decryptedValue = urlParamsDecrypt(value);
      if (!decryptedValue) {
        throw new BadRequestException(`Route Params Decryption Failed`);
      }
      return decryptedValue;
    } else {
      return value;
    }
  },
);
