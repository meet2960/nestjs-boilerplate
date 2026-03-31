import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import type { HealthCheckResult } from '@nestjs/terminus';
import {
  HealthCheck,
  HealthCheckService,
  PrismaHealthIndicator,
} from '@nestjs/terminus';
import { PrismadbService } from '../helpers/prismadb/prismadb.service';

@Controller('health')
export class HealthCheckerController {
  constructor(
    private readonly healthCheckService: HealthCheckService,
    private readonly ormIndicator: PrismaHealthIndicator,
    private readonly prisma: PrismadbService,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Check the health of the application' })
  async check(): Promise<HealthCheckResult> {
    return this.healthCheckService.check([
      () =>
        this.ormIndicator.pingCheck('database', this.prisma, { timeout: 1500 }),
    ]);
  }
}
