import { Global, Module } from '@nestjs/common';
import { ResponseTypeService } from './response-type.service';
import { ResponseTypeController } from './response-type.controller';
@Global()
@Module({
  controllers: [ResponseTypeController],
  providers: [ResponseTypeService],
  exports: [ResponseTypeService],
})
export class ResponseTypeModule {}
