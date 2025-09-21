import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';
import { HealthcheckController } from './healthcheck.controller';

describe('HealthcheckController', () => {
  let app: INestApplication;

  const mockHealthCheckService = {
    check: jest.fn(),
  };

  const mockTypeOrmHealthIndicator = {
    pingCheck: jest.fn(),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [HealthcheckController],
      providers: [HealthCheckService, TypeOrmHealthIndicator],
    })
      .overrideProvider(HealthCheckService)
      .useValue(mockHealthCheckService)
      .overrideProvider(TypeOrmHealthIndicator)
      .useValue(mockTypeOrmHealthIndicator)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/healthcheck (GET)', () => {
    it('should return the healthcheck overview', () => {
      return request(app.getHttpServer())
        .get('/healthcheck')
        .expect(HttpStatus.OK)
        .expect({
          dependencies: [
            { resource_type: 'postgresql', url: '/healthcheck-postgresql' },
          ],
        });
    });
  });
});
