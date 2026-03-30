import { StringField } from '@/decorators';

export class ChangeTpinDto {
  @StringField({
    minLength: 1,
    maxLength: 100,
    swagger: true,
    description: 'Current TPIN',
    default: '',
  })
  current_tpin!: string;

  @StringField({
    minLength: 1,
    maxLength: 100,
    swagger: true,
    description: 'NEW TPIN',
    default: '',
  })
  new_tpin!: string;

  @StringField({
    minLength: 1,
    maxLength: 100,
    swagger: true,
    description: 'Confirm New TPIN',
    default: '',
  })
  cnf_new_tpin!: string;
}
