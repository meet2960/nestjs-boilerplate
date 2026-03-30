import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { EmailField, StringField } from '@/decorators';
import { UserLoginExtraFieldsDto } from './user-login-extra-info.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UserLoginDto {
  @StringField({
    minLength: 1,
    maxLength: 100,
    swagger: true,
    description: 'User Email',
    default: '',
  })
  @EmailField()
  @IsNotEmpty()
  readonly email!: string;

  @StringField({
    minLength: 1,
    maxLength: 150,
    swagger: true,
    description: 'User Password',
    default: '',
  })
  @IsNotEmpty()
  readonly password!: string;

  @ValidateNested({ each: true })
  @IsNotEmpty()
  @Type(() => UserLoginExtraFieldsDto)
  @ApiProperty({ type: () => UserLoginExtraFieldsDto })
  extra_info!: UserLoginExtraFieldsDto;
}
