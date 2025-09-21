import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '@domain/entities/order.entity';
import {
  OrderRepository,
  ORDER_REPOSITORY_NAME,
} from '@domain/repositories/order.repository';
import { OrderTypeORM } from '../schemas/order.schema';
import { OrderMapper } from '../mappers/order.mapper';
import { ProductMapper } from '../mappers/product.mapper';
import { OrderProductTypeORM } from '../schemas/order-product.schema';
import { ProductTypeORM } from '../schemas/product.schema';

@Injectable()
export class OrderRepositoryTypeORM implements OrderRepository {
  constructor(
    @InjectRepository(OrderTypeORM)
    private readonly typeOrmRepository: Repository<OrderTypeORM>,
    @InjectRepository(OrderProductTypeORM)
    private readonly orderProductRepository: Repository<OrderProductTypeORM>,
    @InjectRepository(ProductTypeORM)
    private readonly productRepository: Repository<ProductTypeORM>,
    private readonly orderMapper: OrderMapper,
    private readonly productMapper: ProductMapper,
  ) {}

  async findByOrderId(orderId: string): Promise<Order | null> {
    const orderSchema = await this.typeOrmRepository.findOne({
      where: { orderId },
      relations: ['orderProducts', 'packagingResults'],
    });
    return orderSchema
      ? this.orderMapper.fromSchemaToEntity(orderSchema, true)
      : null;
  }

  async save(order: Order): Promise<Order> {
    const orderSchema = this.orderMapper.fromEntityToSchema(order);
    const savedSchema = await this.typeOrmRepository.save(orderSchema, {
      reload: true,
    });
    return this.orderMapper.fromSchemaToEntity(savedSchema, true);
  }

  async upsert(order: Order): Promise<Order> {
    const orderSchema = this.orderMapper.fromEntityToSchema(order);

    // Try to find existing order by orderId
    const existingOrder = await this.typeOrmRepository.findOne({
      where: { orderId: order.orderId },
    });

    if (existingOrder) {
      // Update existing order
      orderSchema.id = existingOrder.id;
      orderSchema.insertedAt = existingOrder.insertedAt;
    }

    const savedSchema = await this.typeOrmRepository.save(orderSchema, {
      reload: true,
    });
    return this.orderMapper.fromSchemaToEntity(savedSchema, true);
  }
}
