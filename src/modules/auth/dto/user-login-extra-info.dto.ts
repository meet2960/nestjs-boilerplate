import { StringField } from '@/decorators';
import { IsLatitude, IsLongitude, IsNotEmpty } from 'class-validator';

export class UserLoginExtraFieldsDto {
  @StringField({
    minLength: 1,
    maxLength: 40,
    swagger: true,
    description: 'Latitude',
    default: '10.101010',
  })
  @IsLatitude()
  latitude!: string;

  @StringField({
    minLength: 1,
    maxLength: 40,
    swagger: true,
    description: 'Longitude',
    default: '10.101010',
  })
  @IsLongitude()
  longitude!: string;

  @StringField({
    minLength: 1,
    maxLength: 50,
    swagger: true,
    description: 'Device Type',
    default: 'web',
  })
  @IsNotEmpty()
  device_type!: string;
}
