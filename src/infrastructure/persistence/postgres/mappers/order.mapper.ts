import { Injectable } from '@nestjs/common';
import { Order } from '@domain/entities/order.entity';
import { OrderTypeORM } from '../schemas/order.schema';
import { ProductMapper } from './product.mapper';

@Injectable()
export class OrderMapper {
  constructor(private readonly productMapper: ProductMapper) {}

  fromEntityToSchema(order: Order): OrderTypeORM {
    if (!order) return null;

    const orderSchema = new OrderTypeORM();
    orderSchema.orderId = order.orderId;
    orderSchema.id = order.id;
    orderSchema.insertedAt = order.insertedAt;
    orderSchema.updatedAt = order.updatedAt;

    return orderSchema;
  }

  fromSchemaToEntity(orderSchema: OrderTypeORM): Order {
    if (!orderSchema) return null;

    const order = Order.createWithProducts(orderSchema.orderId, []);

    order.id = orderSchema.id;
    order.insertedAt = orderSchema.insertedAt;
    order.updatedAt = orderSchema.updatedAt;

    return order;
  }
}
