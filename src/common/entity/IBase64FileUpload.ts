import { IsOptional } from 'class-validator';
import { IsNullable, NumberField, StringField } from '@/decorators';

export class IBase64FileUpload {
  @StringField({
    minLength: 5,
    maxLength: 100,
    swagger: true,
    description: 'Name of the file',
    default: '',
  })
  file_name!: string;

  @StringField({
    minLength: 1,
    swagger: true,
    description: 'Base64 encoded file data',
    default: '',
  })
  file_base64!: string;

  @StringField({
    minLength: 1,
    swagger: true,
    description: 'Type of the file (e.g., image, document)',
    default: '',
  })
  file_type!: string;

  @NumberField({
    swagger: true,
    description: 'Size of the file in bytes in number format',
    default: 0,
    nullable: true,
  })
  @IsOptional()
  file_size?: number | null;

  @StringField({
    minLength: 1,
    swagger: true,
    description: 'MIME type of the file',
    nullable: true,
    default: '',
  })
  @IsOptional()
  @IsNullable()
  file_mime_type?: string | null;
}
