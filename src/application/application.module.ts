import { Module } from '@nestjs/common';
import { PackagingAlgorithmService } from './services/packaging-algorithm.service';
import { PackageMultipleOrdersUseCase } from './use-cases/package-multiple-orders.use-case';
import { PackagingMapper } from './mappers/packaging.mapper';
import { GetProfessorsTeachingHoursUseCase } from './use-cases/get-professors-teaching-hours.use-case';
import { GetRoomsScheduleUseCase } from './use-cases/get-rooms-schedule.use-case';

@Module({
  providers: [
    PackagingAlgorithmService,
    PackageMultipleOrdersUseCase,
    PackagingMapper,
    GetProfessorsTeachingHoursUseCase,
    GetRoomsScheduleUseCase,
  ],
  exports: [
    PackagingAlgorithmService,
    PackageMultipleOrdersUseCase,
    PackagingMapper,
    GetProfessorsTeachingHoursUseCase,
    GetRoomsScheduleUseCase,
  ],
})
export class ApplicationModule {}
