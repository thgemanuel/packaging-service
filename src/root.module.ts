import { ApplicationModule } from '@application/application.module';
import { DomainModule } from '@domain/domain.module';
import { InfrastructureModule } from '@infrastructure/infrastructure.module';
import { Module, Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [process.env.NODE_ENV == 'test' ? '.env.tests' : '', '.env'],
    }),
    InfrastructureModule,
    DomainModule,
    ApplicationModule,
  ],
  providers: [Logger],
})
export class RootModule {}
