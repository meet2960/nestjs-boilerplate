import {
  Injectable,
  BadRequestException,
  type PipeTransform,
  type ArgumentMetadata,
} from '@nestjs/common';
import { decryptRequest } from '../utility/encryption-utils';

@Injectable()
export class DecryptPayloadPipe implements PipeTransform {
  transform(value: any, _metadata: ArgumentMetadata) {
    if (!value?.data) {
      throw new BadRequestException('Encrypted "data" field is required');
    }

    try {
      const decryptedString = decryptRequest(value.data);
      const parsed = JSON.parse(decryptedString);
      return parsed;
    } catch (err) {
      throw new BadRequestException('Invalid encrypted payload');
    }
  }
}
