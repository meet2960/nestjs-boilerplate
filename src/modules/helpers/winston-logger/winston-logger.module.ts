import { Global, Module } from '@nestjs/common';
import { WinstonLoggerService } from './winston-logger.service';
import { WinstonLoggerController } from './winston-logger.controller';
import { SocketioModule } from '../socketio/socketio.module';

@Global()
@Module({
  imports: [SocketioModule],
  controllers: [WinstonLoggerController],
  providers: [WinstonLoggerService],
  exports: [WinstonLoggerService],
})
export class WinstonLoggerModule {}
