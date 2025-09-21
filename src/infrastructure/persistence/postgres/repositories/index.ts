import { BOX_REPOSITORY_NAME } from '@domain/repositories/box.repository';
import { BoxRepositoryTypeORM } from './box.repository';
import { PRODUCT_REPOSITORY_NAME } from '@domain/repositories/product.repository';
import { ProductRepositoryTypeORM } from './product.repository';
import { ORDER_REPOSITORY_NAME } from '@domain/repositories/order.repository';
import { OrderRepositoryTypeORM } from './order.repository';
import { PACKAGING_RESULT_REPOSITORY_NAME } from '@domain/repositories/packaging-result.repository';
import { PackagingResultRepositoryTypeORM } from './packaging-result.repository';
import { PostgresProfessorRepository } from './professor.repository';
import { PostgresRoomRepository } from './room.repository';

export const repositories = [
  {
    provide: BOX_REPOSITORY_NAME,
    useClass: BoxRepositoryTypeORM,
  },
  {
    provide: PRODUCT_REPOSITORY_NAME,
    useClass: ProductRepositoryTypeORM,
  },
  {
    provide: ORDER_REPOSITORY_NAME,
    useClass: OrderRepositoryTypeORM,
  },
  {
    provide: PACKAGING_RESULT_REPOSITORY_NAME,
    useClass: PackagingResultRepositoryTypeORM,
  },
  {
    provide: 'ProfessorRepository',
    useClass: PostgresProfessorRepository,
  },
  {
    provide: 'RoomRepository',
    useClass: PostgresRoomRepository,
  },
];
