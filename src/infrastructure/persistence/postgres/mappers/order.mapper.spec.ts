import { Test, TestingModule } from '@nestjs/testing';
import { OrderMapper } from './order.mapper';
import { OrderTypeORM } from '../schemas/order.schema';
import { Order } from '@domain/entities/order.entity';
import { ProductMapper } from './product.mapper';

describe('OrderMapper', () => {
  let mapper: OrderMapper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderMapper,
        {
          provide: ProductMapper,
          useValue: {
            fromSchemaToEntity: jest.fn(),
          },
        },
      ],
    }).compile();

    mapper = module.get<OrderMapper>(OrderMapper);
  });

  describe('fromEntityToSchema', () => {
    it('should convert Order entity to OrderTypeORM schema', () => {
      // Arrange
      const order = new Order('ORDER001');
      order.id = 'order-id';
      order.insertedAt = new Date('2023-01-01');
      order.updatedAt = new Date('2023-01-02');

      // Act
      const result = mapper.fromEntityToSchema(order);

      // Assert
      expect(result).toBeInstanceOf(OrderTypeORM);
      expect(result.orderId).toBe('ORDER001');
      expect(result.id).toBe('order-id');
      expect(result.insertedAt).toEqual(new Date('2023-01-01'));
      expect(result.updatedAt).toEqual(new Date('2023-01-02'));
    });

    it('should return null when order is null', () => {
      // Act
      const result = mapper.fromEntityToSchema(null);

      // Assert
      expect(result).toBeNull();
    });

    it('should return null when order is undefined', () => {
      // Act
      const result = mapper.fromEntityToSchema(undefined);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('fromSchemaToEntity', () => {
    it('should convert OrderTypeORM schema to Order entity', () => {
      // Arrange
      const orderSchema = new OrderTypeORM();
      orderSchema.id = 'order-id';
      orderSchema.orderId = 'ORDER001';
      orderSchema.insertedAt = new Date('2023-01-01');
      orderSchema.updatedAt = new Date('2023-01-02');

      // Act
      const result = mapper.fromSchemaToEntity(orderSchema);

      // Assert
      expect(result).toBeInstanceOf(Order);
      expect(result.orderId).toBe('ORDER001');
      expect(result.id).toBe('order-id');
      expect(result.insertedAt).toEqual(new Date('2023-01-01'));
      expect(result.updatedAt).toEqual(new Date('2023-01-02'));
    });

    it('should convert OrderTypeORM schema to Order entity with loadProducts flag', () => {
      // Arrange
      const orderSchema = new OrderTypeORM();
      orderSchema.id = 'order-id';
      orderSchema.orderId = 'ORDER001';
      orderSchema.insertedAt = new Date('2023-01-01');
      orderSchema.updatedAt = new Date('2023-01-02');

      // Act
      const result = mapper.fromSchemaToEntity(orderSchema);

      // Assert
      expect(result).toBeInstanceOf(Order);
      expect(result.orderId).toBe('ORDER001');
      expect(result.id).toBe('order-id');
      expect(result.insertedAt).toEqual(new Date('2023-01-01'));
      expect(result.updatedAt).toEqual(new Date('2023-01-02'));
    });

    it('should return null when orderSchema is null', () => {
      // Act
      const result = mapper.fromSchemaToEntity(null);

      // Assert
      expect(result).toBeNull();
    });

    it('should return null when orderSchema is undefined', () => {
      // Act
      const result = mapper.fromSchemaToEntity(undefined);

      // Assert
      expect(result).toBeNull();
    });
  });
});
