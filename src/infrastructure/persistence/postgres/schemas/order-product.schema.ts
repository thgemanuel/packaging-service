import { Entity, ManyToOne, JoinColumn } from 'typeorm';
import { AbstractSchema } from './abstract.schema';
import type { OrderTypeORM } from './order.schema';
import type { ProductTypeORM } from './product.schema';

@Entity('order_products')
export class OrderProductTypeORM extends AbstractSchema {
  @ManyToOne('OrderTypeORM', 'orderProducts', {
    lazy: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'order_id' })
  order?: Promise<OrderTypeORM>;

  @ManyToOne('ProductTypeORM', 'orderProducts', {
    lazy: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product?: Promise<ProductTypeORM>;
}
