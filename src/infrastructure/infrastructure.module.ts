import { Global, Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationModule } from '@application/application.module';
import { HealthcheckController } from './controllers/healthcheck.controller';
import { PackagingController } from './controllers/packaging.controller';
import { repositories } from './persistence/postgres/repositories';
import { schemas } from './persistence/postgres/schemas';
import { mappers } from './persistence/postgres/mappers';
// import { PubSubClient } from './messaging/pubsub/pubsub-client'; // Removed PubSub
// import { messaging } from './messaging'; // Removed messaging
import { TerminusModule } from '@nestjs/terminus';
// import { ProposalPeopleController } from './controllers/proposal-people.controller'; // Will be removed
import { HttpModule } from '@nestjs/axios';
// import { PeopleServiceImpl } from './services/people.service'; // Will be removed
// import { PEOPLE_SERVICE_NAME } from '@application/services/people-service'; // Will be removed

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      synchronize: false,
      autoLoadEntities: true,
    }),
    TypeOrmModule.forFeature(schemas),
    ApplicationModule,
    TerminusModule,
    HttpModule,
  ],
  providers: [
    Logger,
    ...repositories,
    ...mappers,
    // ...messaging, // Removed messaging
    // PubSubClient removed
    // PEOPLE_SERVICE_NAME removed
  ],
  exports: [
    ...repositories.map((repo) => repo.provide),
    // ...messaging.map((message) => message.provide), // Removed messaging
    // PEOPLE_SERVICE_NAME, // Removed
    Logger,
  ],
  controllers: [
    HealthcheckController,
    PackagingController,
    // ProposalPeopleController, // Will be removed
  ],
})
export class InfrastructureModule {}
