import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T> {
  @ApiProperty({ example: 'success', default: 'success' })
  status!: 'success' | 'error';

  @ApiProperty({ example: 200, default: 200 })
  statusCode!: number;

  @ApiProperty({
    example: 'Operation completed successfully',
    default: 'Operation completed successfully',
  })
  message!: string;

  @ApiProperty({ example: {}, nullable: true })
  data!: T;

  @ApiProperty({ example: '', nullable: true })
  error?: string;
}
