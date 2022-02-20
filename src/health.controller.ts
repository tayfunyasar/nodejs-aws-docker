import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HttpHealthIndicator,
  HealthCheck,
} from '@nestjs/terminus';
import { ApiExcludeController } from '@nestjs/swagger';

@Controller('health')
@ApiExcludeController(true)
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
  ) { }

  @Get()
  @HealthCheck()
  check() {
    // check external service health,
    // stop traffic if fail,

    return this.health.check([
      () =>
        this.http.pingCheck(
          'mock-service-health',
          `${process.env.EXTERNAL_SERVICE_URL}/supply-chain`,
        ),
    ]);
  }
}
