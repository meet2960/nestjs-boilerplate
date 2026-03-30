import { Global, Module } from '@nestjs/common';
import { CommonMethodService } from './common-method.service';
import { SocketioModule } from '../socketio/socketio.module';
import { CommonMethodController } from './common-method.controller';

@Global()
@Module({
  imports: [SocketioModule],
  controllers: [CommonMethodController],
  providers: [CommonMethodService],
  exports: [CommonMethodService],
})
export class CommonMethodModule {}
