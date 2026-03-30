import {
  Injectable,
  type NestInterceptor,
  type ExecutionContext,
  type CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MetricsService } from '@/modules/helpers/metrics/metrics.service';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  constructor(private readonly metricsService: MetricsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const start = process.hrtime.bigint();

    return next.handle().pipe(
      tap(() => {
        const end = process.hrtime.bigint();
        const durationSeconds = Number(end - start) / 1e9;

        this.metricsService.httpRequestDuration.observe(
          {
            method: req.method,
            route: req.route?.path || 'unknown',
            status: res.statusCode,
          },
          durationSeconds,
        );
      }),
    );
  }
}
