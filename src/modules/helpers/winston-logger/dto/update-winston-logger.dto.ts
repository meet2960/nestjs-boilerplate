import { PartialType } from '@nestjs/swagger';
import { CreateWinstonLoggerDto } from './create-winston-logger.dto';

export class UpdateWinstonLoggerDto extends PartialType(CreateWinstonLoggerDto) {}
