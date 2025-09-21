import { ApplicationModule } from '@application/application.module';
import { DomainModule } from '@domain/domain.module';
import { InfrastructureModule } from '@infrastructure/infrastructure.module';
import { Module, Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// import { SentryModule } from '@sentry/nestjs/setup'; // Removed Sentry integration

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [process.env.NODE_ENV == 'test' ? '.env.tests' : '', '.env'],
    }),
    // SentryModule.forRoot(), // Removed Sentry integration
    InfrastructureModule,
    DomainModule,
    ApplicationModule,
  ],
  providers: [Logger],
})
export class RootModule {}
