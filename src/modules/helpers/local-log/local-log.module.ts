import { Module } from '@nestjs/common';
import { LocalLogService } from './local-log.service';
import { LocalLogController } from './local-log.controller';

@Module({
  imports: [],
  controllers: [LocalLogController],
  providers: [LocalLogService],
  exports: [LocalLogService],
})
export class LocalLogModule {}
