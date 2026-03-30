import { Controller, Get, Res } from '@nestjs/common';
import { type Response } from 'express';
import { MetricsService } from './metrics.service';


@Controller('api/metrics-prometheus')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}
  @Get()
  async metrics(@Res() res: Response) {
    res.set('Content-Type', 'text/plain');
    res.send(await this.metricsService.getMetrics());
  }
}