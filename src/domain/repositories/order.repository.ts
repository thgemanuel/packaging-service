import { Order } from '../entities/order.entity';

export interface OrderRepository {
  findByOrderId(orderId: string): Promise<Order | null>;
  save(order: Order): Promise<Order>;
  upsert(order: Order): Promise<Order>;
}

export const ORDER_REPOSITORY_NAME = 'OrderRepository';
