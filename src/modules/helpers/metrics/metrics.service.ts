import { Injectable } from '@nestjs/common';
import * as client from 'prom-client';

@Injectable()
export class MetricsService {
  public httpRequestDuration: client.Histogram<string>;

  constructor() {
    // Collect default Node.js metrics (CPU, memory, GC, etc.)
    // client.collectDefaultMetrics();

    // THIS is the metric you are querying in Prometheus
    this.httpRequestDuration = new client.Histogram({
      name: 'http_request_duration_seconds',
      help: 'HTTP request latency',
      labelNames: ['method', 'route', 'status'],
      buckets: [0.1, 0.3, 0.5, 1, 2, 5],
    });
  }

  getMetrics() {
    return client.register.metrics();
  }
}
