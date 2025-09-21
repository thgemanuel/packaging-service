import { Global, Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationModule } from '@application/application.module';
import { HealthcheckController } from './controllers/healthcheck.controller';
import { PackagingController } from './controllers/packaging.controller';
import { repositories } from './persistence/postgres/repositories';
import { schemas } from './persistence/postgres/schemas';
import { mappers } from './persistence/postgres/mappers';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';

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
  providers: [Logger, ...repositories, ...mappers],
  exports: [...repositories.map((repo) => repo.provide), Logger],
  controllers: [HealthcheckController, PackagingController],
})
export class InfrastructureModule {}
