import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';
import { PubSubClient } from '../messaging/pubsub/pubsub-client';
import { HealthcheckController } from './healthcheck.controller';

describe('HealthcheckController', () => {
  let app: INestApplication;

  const mockHealthCheckService = {
    check: jest.fn(),
  };

  const mockTypeOrmHealthIndicator = {
    pingCheck: jest.fn(),
  };

  const mockPubSubClient = {
    isOpen: jest.fn(),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [HealthcheckController],
      providers: [HealthCheckService, TypeOrmHealthIndicator, PubSubClient],
    })
      .overrideProvider(HealthCheckService)
      .useValue(mockHealthCheckService)
      .overrideProvider(TypeOrmHealthIndicator)
      .useValue(mockTypeOrmHealthIndicator)
      .overrideProvider(PubSubClient)
      .useValue(mockPubSubClient)
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
            { resource_type: 'pubsub', url: '/healthcheck-pubsub' },
          ],
        });
    });
  });
});
