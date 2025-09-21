import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';
interface HealthCheckResult {
  dependencies: Record<string, string>[];
}

@Controller()
export class HealthcheckController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
  ) {}

  @ApiTags('Healthcheck')
  @ApiOperation({ summary: 'Verifica o status do serviço e suas dependências' })
  @Get(['/healthcheck'])
  healthcheck(): HealthCheckResult {
    return {
      dependencies: [
        { resource_type: 'postgresql', url: '/healthcheck-postgresql' },
      ],
    };
  }
}
