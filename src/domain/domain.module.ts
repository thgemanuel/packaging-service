import { Module } from '@nestjs/common';

// Domain services and utilities can be provided here if needed
// Domain entities, value objects, and repositories are pure domain logic
// and don't need to be registered in the DI container

@Module({
  providers: [
    // Domain services would go here if we had any
    // For now, the domain layer is pure business logic without dependencies
  ],
  exports: [
    // Export domain services if any are added later
  ],
})
export class DomainModule {}