import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { Response } from 'express';
interface HealthCheckResult {
  dependencies: Record<string, string>[];
}

interface HealthCheckDependencyResult {
  status: number;
  response_time: string;
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
