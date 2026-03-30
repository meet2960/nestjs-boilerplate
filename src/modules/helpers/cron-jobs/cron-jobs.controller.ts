import { Controller, Param, Post, Get, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { CronJobsService } from './cron-jobs.service';
import { AuthDecorator } from '@/decorators';

@Controller('cron-jobs')
@ApiTags('Cron Jobs')
@AuthDecorator()
export class CronJobsController {
  constructor(private readonly cronJobsService: CronJobsService) {}

  @Get('status/:name')
  status(@Param('name') name: string, @Res() res: Response) {
    const response = this.cronJobsService.getCronStatus(name);
    res.status(200).json(response);
  }

  @Post('start/:name')
  start(@Param('name') name: string, @Res() res: Response) {
    const response = this.cronJobsService.startCron(name);
    res.status(200).json(response);
  }

  @Post('stop/:name')
  stop(@Param('name') name: string, @Res() res: Response) {
    const response = this.cronJobsService.stopCron(name);
    res.status(200).json(response);
  }
}
