import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { AbstractSchema } from './abstract.schema';
import type { OrderTypeORM } from './order.schema';
import type { BoxTypeORM } from './box.schema';

@Entity('packaging_results')
export class PackagingResultTypeORM extends AbstractSchema {
  @ManyToOne('OrderTypeORM', 'packagingResults', {
    lazy: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'order_id' })
  order?: Promise<OrderTypeORM>;

  @ManyToOne('BoxTypeORM', 'packagingResults', {
    lazy: true,
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'box_id' })
  box?: Promise<BoxTypeORM>;

  @Column({ name: 'box_type', type: 'varchar', length: 255, nullable: true })
  boxType: string;

  @Column({ name: 'products_json', type: 'jsonb' })
  productsJson: any;

  @Column({ name: 'observation', type: 'text', nullable: true })
  observation: string;
}
