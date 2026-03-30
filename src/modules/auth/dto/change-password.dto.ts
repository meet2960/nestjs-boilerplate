import { StringField } from '@/decorators';

export class ChangePasswordDto {
  @StringField({
    minLength: 1,
    maxLength: 100,
    swagger: true,
    description: 'Current Password',
    default: '',
  })
  current_password!: string;

  @StringField({
    minLength: 1,
    maxLength: 100,
    swagger: true,
    description: 'New Password',
    default: '',
  })
  new_password!: string;

  @StringField({
    minLength: 1,
    maxLength: 100,
    swagger: true,
    description: 'Confirm New Password',
    default: '',
  })
  cnf_new_password!: string;
}
