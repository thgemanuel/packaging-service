import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractSchema } from './abstract.schema';
import type { OrderProductTypeORM } from './order-product.schema';
import type { PackagingResultTypeORM } from './packaging-result.schema';

@Entity('orders')
export class OrderTypeORM extends AbstractSchema {
  @Column({ name: 'order_id', type: 'varchar', length: 255, unique: true })
  orderId: string;

  @OneToMany('OrderProductTypeORM', 'order', {
    lazy: true,
    cascade: ['insert'],
  })
  orderProducts?: Promise<OrderProductTypeORM[]>;

  @OneToMany('PackagingResultTypeORM', 'order', {
    lazy: true,
    cascade: ['insert'],
  })
  packagingResults?: Promise<PackagingResultTypeORM[]>;
}
