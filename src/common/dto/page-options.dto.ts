import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';
import { EnumFieldOptional, NumberField, StringField } from '@/decorators';
import { Order } from '../constants';

export class PageOptionsDto {
  @NumberField({
    int: true,
    minimum: 1,
    default: 10,
  })
  readonly rowPerPage!: number;

  @NumberField({
    int: true,
    minimum: 1,
    default: 1,
  })
  readonly currentPage!: number;

  @EnumFieldOptional(() => Order, {
    default: Order.ASC,
  })
  readonly sortOrder!: Order;

  @StringField({
    swagger: true,
    description: 'Field Name to sort by results',
    minLength: 1,
    maxLength: 50,
    default: 'created_date',
  })
  readonly sortBy!: string;

  @IsString()
  @MaxLength(200)
  @ApiProperty({
    description: 'Search term for filtering results',
    maxLength: 200,
    default: '',
  })
  readonly searchTerm!: string;

  get skip(): number {
    return (this.currentPage - 1) * this.rowPerPage;
  }

  get take(): number {
    return this.rowPerPage;
  }

  get order(): Order {
    return this.sortOrder;
  }
}
