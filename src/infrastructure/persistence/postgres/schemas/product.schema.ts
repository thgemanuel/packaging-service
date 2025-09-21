import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractSchema } from './abstract.schema';
import type { OrderProductTypeORM } from './order-product.schema';

@Entity('products')
export class ProductTypeORM extends AbstractSchema {
  @Column({ name: 'product_id', type: 'varchar', length: 255 })
  productId: string;

  @Column({ name: 'height', type: 'decimal', precision: 8, scale: 2 })
  height: number;

  @Column({ name: 'width', type: 'decimal', precision: 8, scale: 2 })
  width: number;

  @Column({ name: 'length', type: 'decimal', precision: 8, scale: 2 })
  length: number;

  @OneToMany('OrderProductTypeORM', 'product', {
    lazy: true,
    cascade: ['insert'],
  })
  orderProducts?: Promise<OrderProductTypeORM[]>;
}
