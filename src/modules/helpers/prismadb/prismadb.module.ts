import { Global, Module } from '@nestjs/common';
import { PrismadbService } from './prismadb.service';
import { PrismadbController } from './prismadb.controller';

@Global()
@Module({
  controllers: [PrismadbController],
  providers: [PrismadbService],
  exports: [PrismadbService],
})
export class PrismadbModule {}
