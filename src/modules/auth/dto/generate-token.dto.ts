import { StringField } from '@/decorators';
import { Type } from 'class-transformer';
import { IsObject } from 'class-validator';

export class GenerateTokenDto {
  @StringField({
    example: '',
    description: 'The secret key to sign the token with',
    required: true,
    default: '',
  })
  secretKey!: string;

  @IsObject()
  @Type(() => Object)
  data!: Record<string, any>;

  @StringField({
    example: 'HS256',
    description: 'The algorithm to sign the token with',
    required: false,
    default: 'HS256',
  })
  algorithm!: string;
}
