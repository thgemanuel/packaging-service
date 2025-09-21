import { Module } from '@nestjs/common';
import { PackagingAlgorithmService } from './services/packaging-algorithm.service';
import { PackageMultipleOrdersUseCase } from './use-cases/package-multiple-orders.use-case';
import { PackagingMapper } from './mappers/packaging.mapper';

@Module({
  providers: [
    PackagingAlgorithmService,
    PackageMultipleOrdersUseCase,
    PackagingMapper,
  ],
  exports: [
    PackagingAlgorithmService,
    PackageMultipleOrdersUseCase,
    PackagingMapper,
  ],
})
export class ApplicationModule {}
