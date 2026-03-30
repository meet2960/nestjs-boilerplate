import { Module } from '@nestjs/common';
import { ServiceInvokerModule } from '@/modules/api/service-invoker/service-invoker.module';
import { CronJobsService } from './cron-jobs.service';
import { CronJobsController } from './cron-jobs.controller';

@Module({
  imports: [ServiceInvokerModule],
  controllers: [CronJobsController],
  providers: [CronJobsService],
  exports: [CronJobsService],
})
export class CronJobsModule {}
