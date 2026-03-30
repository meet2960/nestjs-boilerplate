import { IsEnum, IsNumber, IsString } from 'class-validator';

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class ListPageDto {
  @IsNumber()
  row_Per_Page!: number;

  @IsNumber()
  current_Page!: number;

  @IsEnum(SortOrder)
  sort_order!: SortOrder;

  @IsString()
  sort_By!: string;

  @IsString()
  search_term!: string;
}
