import { Test, TestingModule } from '@nestjs/testing';
import { PackagingAlgorithmService } from './packaging-algorithm.service';
import { Order } from '@domain/entities/order.entity';
import { Product } from '@domain/entities/product.entity';
import { Box } from '@domain/entities/box.entity';
import { BoxType } from '@domain/enums/box-type.enum';
import { Dimensions } from '@domain/value-objects/dimensions.vo';
import { EmptyOrderException } from '@domain/exceptions/empty-order.exception';

describe('PackagingAlgorithmService', () => {
  let service: PackagingAlgorithmService;
  let availableBoxes: Box[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PackagingAlgorithmService],
    }).compile();

    service = module.get<PackagingAlgorithmService>(PackagingAlgorithmService);

    // Create available boxes
    availableBoxes = [
      Box.createFromType(BoxType.CAIXA_1), // 30x40x80
      Box.createFromType(BoxType.CAIXA_2), // 50x50x40
      Box.createFromType(BoxType.CAIXA_3), // 50x80x60
    ];
  });

  describe('packOrder', () => {
    it('should throw error for empty order', () => {
      const emptyOrder = new Order('ORDER001');

      expect(() => service.packOrder(emptyOrder, availableBoxes)).toThrow(
        EmptyOrderException,
      );
    });

    it('should pack single product successfully', () => {
      const product = new Product('PS5', new Dimensions(25, 35, 70));
      const order = new Order('ORDER001', [product]);

      const results = service.packOrder(order, availableBoxes);

      expect(results).toHaveLength(1);
      expect(results[0].orderId).toBe('ORDER001');
      expect(results[0].boxType).toBe(BoxType.CAIXA_1); // Should fit in smallest box
      expect(results[0].products[0].productId).toBe('PS5');
      expect(results[0].observation).toBeNull();
    });

    it('should pack multiple products in single box when they fit', () => {
      const products = [
        new Product('PROD1', new Dimensions(10, 10, 10)),
        new Product('PROD2', new Dimensions(15, 15, 15)),
        new Product('PROD3', new Dimensions(20, 20, 20)),
      ];
      const order = new Order('ORDER001', products);

      const results = service.packOrder(order, availableBoxes);

      expect(results).toHaveLength(1);
      expect(results[0].products).toHaveLength(3);
      expect(results[0].products.some((p) => p.productId === 'PROD1')).toBe(
        true,
      );
      expect(results[0].products.some((p) => p.productId === 'PROD2')).toBe(
        true,
      );
      expect(results[0].products.some((p) => p.productId === 'PROD3')).toBe(
        true,
      );
    });

    it('should pack multiple products in multiple boxes when needed', () => {
      const products = [
        new Product('LARGE1', new Dimensions(40, 30, 70)), // Fits in Caixa 1
        new Product('LARGE2', new Dimensions(45, 45, 35)), // Fits in Caixa 2
        new Product('LARGE3', new Dimensions(45, 70, 50)), // Fits in Caixa 3
      ];
      const order = new Order('ORDER001', products);

      const results = service.packOrder(order, availableBoxes);

      expect(results).toHaveLength(3);
      expect(results[0].products).toHaveLength(1);
      expect(results[1].products).toHaveLength(1);
      expect(results[2].products).toHaveLength(1);
    });

    it('should handle products that do not fit in any box', () => {
      const products = [
        new Product('FITS', new Dimensions(25, 35, 70)),
        new Product('TOO_LARGE', new Dimensions(100, 100, 100)),
      ];
      const order = new Order('ORDER001', products);

      const results = service.packOrder(order, availableBoxes);

      expect(results).toHaveLength(2);

      // One successful result
      const successResult = results.find((r) =>
        r.products.some((p) => p.productId === 'FITS'),
      );
      expect(successResult).toBeDefined();
      expect(successResult!.observation).toBeNull();

      // One failed result
      const failedResult = results.find((r) =>
        r.products.some((p) => p.productId === 'TOO_LARGE'),
      );
      expect(failedResult).toBeDefined();
      expect(failedResult!.boxType).toBeNull();
      expect(failedResult!.observation).toBe(
        'Produto não cabe em nenhuma caixa disponível.',
      );
    });

    it('should return only failed results when no products fit', () => {
      const products = [
        new Product('TOO_LARGE1', new Dimensions(100, 100, 100)),
        new Product('TOO_LARGE2', new Dimensions(200, 200, 200)),
      ];
      const order = new Order('ORDER001', products);

      const results = service.packOrder(order, availableBoxes);

      expect(results).toHaveLength(1);
      expect(results[0].boxType).toBeNull();
      expect(results[0].products).toHaveLength(2);
      expect(results[0].observation).toBe(
        'Produto não cabe em nenhuma caixa disponível.',
      );
    });

    it('should sort products by volume (largest first)', () => {
      const products = [
        new Product('SMALL', new Dimensions(5, 5, 5)), // Volume: 125
        new Product('MEDIUM', new Dimensions(10, 10, 10)), // Volume: 1000
        new Product('LARGE', new Dimensions(20, 20, 20)), // Volume: 8000
      ];
      const order = new Order('ORDER001', products);

      const results = service.packOrder(order, availableBoxes);

      expect(results).toHaveLength(1);
      // Products should be packed in order: LARGE, MEDIUM, SMALL
      expect(results[0].products[0].productId).toBe('LARGE');
      expect(results[0].products[1].productId).toBe('MEDIUM');
      expect(results[0].products[2].productId).toBe('SMALL');
    });

    it('should respect capacity utilization limit', () => {
      // Create products that individually fit but together exceed the 90% limit
      const products = [
        new Product('PROD1', new Dimensions(25, 35, 70)), // Volume: 61250
        new Product('PROD2', new Dimensions(25, 35, 70)), // Volume: 61250
        new Product('PROD3', new Dimensions(25, 35, 70)), // Volume: 61250
      ];
      const order = new Order('ORDER001', products);

      const results = service.packOrder(order, availableBoxes);

      // Should split into multiple boxes due to capacity limit
      expect(results.length).toBeGreaterThan(1);
    });

    it('should choose smallest available box for each product', () => {
      const product = new Product('PS5', new Dimensions(25, 35, 70));
      const order = new Order('ORDER001', [product]);

      const results = service.packOrder(order, availableBoxes);

      expect(results).toHaveLength(1);
      expect(results[0].boxType).toBe(BoxType.CAIXA_1); // Smallest box that fits
    });

    it('should handle empty available boxes array', () => {
      const product = new Product('PS5', new Dimensions(25, 35, 70));
      const order = new Order('ORDER001', [product]);

      const results = service.packOrder(order, []);

      expect(results).toHaveLength(1);
      expect(results[0].boxType).toBeNull();
      expect(results[0].observation).toBe(
        'Produto não cabe em nenhuma caixa disponível.',
      );
    });

    it('should handle products with zero volume', () => {
      expect(() => {
        const products = [
          new Product('ZERO_VOLUME', new Dimensions(0, 10, 20)),
        ];
        const order = new Order('ORDER001', products);
        service.packOrder(order, availableBoxes);
      }).toThrow('All dimensions must be positive numbers');
    });

    it('should handle order with duplicate products', () => {
      const product1 = new Product('PS5', new Dimensions(25, 35, 70));
      const product2 = new Product('PS5', new Dimensions(25, 35, 70));

      expect(() => new Order('ORDER001', [product1, product2])).toThrow();
    });
  });

  describe('capacity utilization', () => {
    it('should not exceed 90% capacity utilization', () => {
      // Create products that would exceed 90% of Caixa 1 volume (96,000)
      const products = [
        new Product('PROD1', new Dimensions(30, 40, 80)), // Volume: 96,000 (100% of Caixa 1)
      ];
      const order = new Order('ORDER001', products);

      const results = service.packOrder(order, availableBoxes);

      expect(results).toHaveLength(1);
      expect(results[0].products).toHaveLength(1);
    });

    it('should split products when they exceed capacity limit', () => {
      // Create two products that together exceed 90% of any single box
      const products = [
        new Product('PROD1', new Dimensions(25, 35, 70)), // Volume: 61,250
        new Product('PROD2', new Dimensions(25, 35, 70)), // Volume: 61,250
        new Product('PROD3', new Dimensions(25, 35, 70)), // Volume: 61,250
      ];
      const order = new Order('ORDER001', products);

      const results = service.packOrder(order, availableBoxes);

      // Should be split into multiple boxes
      expect(results.length).toBeGreaterThan(1);
    });
  });
});
