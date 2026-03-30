import { DateField, NumberField } from '@/decorators';

export class BaseModel {
  @NumberField({
    description: 'User who created the record',
    nullable: true,
    default: null,
  })
  created_by!: number | null;

  @DateField({
    description: 'Date when the record was created',
    default: new Date().toISOString(),
  })
  created_date!: Date;

  @NumberField({
    description: 'User who last modified the record',
    nullable: true,
    default: null,
  })
  modified_by!: number | null;

  @DateField({
    description: 'Date the record was last modified',
    default: null,
    nullable: true,
  })
  modified_date!: Date | null;
}
