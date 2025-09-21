import { Order } from './order.entity';
import { Product } from './product.entity';
import { Dimensions } from '../value-objects/dimensions.vo';
import { EmptyOrderException } from '../exceptions/empty-order.exception';
import { InvalidDimensionsException } from '../exceptions/invalid-dimensions.exception';

describe('Order', () => {
  let order: Order;
  let product1: Product;
  let product2: Product;

  beforeEach(() => {
    order = new Order('ORDER001');
    product1 = new Product('PROD001', new Dimensions(10, 20, 30));
    product2 = new Product('PROD002', new Dimensions(15, 25, 35));
  });

  describe('constructor', () => {
    it('should create an order with valid ID', () => {
      expect(order.orderId).toBe('ORDER001');
      expect(order.products).toEqual([]);
      expect(order.productCount).toBe(0);
    });

    it('should create an order with products', () => {
      const orderWithProducts = new Order('ORDER002', [product1, product2]);

      expect(orderWithProducts.orderId).toBe('ORDER002');
      expect(orderWithProducts.productCount).toBe(2);
      expect(orderWithProducts.products).toContain(product1);
      expect(orderWithProducts.products).toContain(product2);
    });

    it('should throw error for empty order ID', () => {
      expect(() => new Order('')).toThrow('Order ID cannot be empty');
    });

    it('should throw error for whitespace-only order ID', () => {
      expect(() => new Order('   ')).toThrow('Order ID cannot be empty');
    });

    it('should throw error for duplicate products', () => {
      const duplicateProduct = new Product(
        'PROD001',
        new Dimensions(5, 10, 15),
      );
      expect(() => new Order('ORDER003', [product1, duplicateProduct])).toThrow(
        'Order cannot contain duplicate products',
      );
    });

    it('should trim order ID', () => {
      const orderWithSpaces = new Order('  ORDER001  ');
      expect(orderWithSpaces.orderId).toBe('ORDER001');
    });
  });

  describe('getters', () => {
    it('should return a copy of products array', () => {
      order.addProduct(product1);
      const products = order.products;

      // Modifying the returned array should not affect the original
      products.push(product2);
      expect(order.productCount).toBe(1);
    });
  });

  describe('isEmpty', () => {
    it('should return true for empty order', () => {
      expect(order.isEmpty()).toBe(true);
    });

    it('should return false for order with products', () => {
      order.addProduct(product1);
      expect(order.isEmpty()).toBe(false);
    });
  });

  describe('getTotalVolume', () => {
    it('should return 0 for empty order', () => {
      expect(order.getTotalVolume()).toBe(0);
    });

    it('should return correct total volume', () => {
      order.addProduct(product1);
      order.addProduct(product2);

      const expectedVolume = product1.getVolume() + product2.getVolume();
      expect(order.getTotalVolume()).toBe(expectedVolume);
    });
  });

  describe('addProduct', () => {
    it('should add product to order', () => {
      order.addProduct(product1);

      expect(order.productCount).toBe(1);
      expect(order.products).toContain(product1);
    });

    it('should throw error for null product', () => {
      expect(() => order.addProduct(null as any)).toThrow(
        'Product cannot be null or undefined',
      );
    });

    it('should throw error for duplicate product', () => {
      order.addProduct(product1);
      expect(() => order.addProduct(product1)).toThrow(
        "Product 'PROD001' already exists in order 'ORDER001'",
      );
    });

    it('should touch the entity when adding product', () => {
      order.addProduct(product1);
      expect(order.productCount).toBe(1);
    });
  });

  describe('removeProduct', () => {
    beforeEach(() => {
      order.addProduct(product1);
      order.addProduct(product2);
    });

    it('should remove existing product', () => {
      const result = order.removeProduct('PROD001');

      expect(result).toBe(true);
      expect(order.productCount).toBe(1);
      expect(order.hasProduct('PROD001')).toBe(false);
    });

    it('should return false for non-existing product', () => {
      const result = order.removeProduct('NONEXISTENT');

      expect(result).toBe(false);
      expect(order.productCount).toBe(2);
    });

    it('should touch the entity when removing product', () => {
      order.removeProduct('PROD001');
      expect(order.productCount).toBe(1);
    });
  });

  describe('getProduct', () => {
    beforeEach(() => {
      order.addProduct(product1);
    });

    it('should return existing product', () => {
      const foundProduct = order.getProduct('PROD001');
      expect(foundProduct).toBe(product1);
    });

    it('should return undefined for non-existing product', () => {
      const foundProduct = order.getProduct('NONEXISTENT');
      expect(foundProduct).toBeUndefined();
    });
  });

  describe('hasProduct', () => {
    beforeEach(() => {
      order.addProduct(product1);
    });

    it('should return true for existing product', () => {
      expect(order.hasProduct('PROD001')).toBe(true);
    });

    it('should return false for non-existing product', () => {
      expect(order.hasProduct('NONEXISTENT')).toBe(false);
    });
  });

  describe('getProductsSortedByVolume', () => {
    beforeEach(() => {
      order.addProduct(product1); // Volume: 6000
      order.addProduct(product2); // Volume: 13125
    });

    it('should return products sorted by volume (descending)', () => {
      const sortedProducts = order.getProductsSortedByVolume();

      expect(sortedProducts[0]).toBe(product2); // Larger volume first
      expect(sortedProducts[1]).toBe(product1);
    });

    it('should return a copy of the array', () => {
      const sortedProducts = order.getProductsSortedByVolume();
      sortedProducts.push(new Product('PROD003', new Dimensions(1, 1, 1)));

      expect(order.productCount).toBe(2);
    });
  });

  describe('getProductsSortedByDimension', () => {
    beforeEach(() => {
      order.addProduct(product1); // Height: 10
      order.addProduct(product2); // Height: 15
    });

    it('should return products sorted by height (descending)', () => {
      const sortedProducts = order.getProductsSortedByDimension('height');

      expect(sortedProducts[0]).toBe(product2); // Height: 15
      expect(sortedProducts[1]).toBe(product1); // Height: 10
    });

    it('should return products sorted by width (descending)', () => {
      const sortedProducts = order.getProductsSortedByDimension('width');

      expect(sortedProducts[0]).toBe(product2); // Width: 25
      expect(sortedProducts[1]).toBe(product1); // Width: 20
    });

    it('should return products sorted by length (descending)', () => {
      const sortedProducts = order.getProductsSortedByDimension('length');

      expect(sortedProducts[0]).toBe(product2); // Length: 35
      expect(sortedProducts[1]).toBe(product1); // Length: 30
    });
  });

  describe('validateForProcessing', () => {
    it('should throw error for empty order', () => {
      expect(() => order.validateForProcessing()).toThrow(EmptyOrderException);
    });

    it('should pass validation for valid order', () => {
      order.addProduct(product1);
      expect(() => order.validateForProcessing()).not.toThrow();
    });

    it('should throw error for product with invalid volume', () => {
      expect(() => {
        const invalidProduct = new Product(
          'INVALID',
          new Dimensions(0, 10, 20),
        );
        order.addProduct(invalidProduct);
      }).toThrow('All dimensions must be positive numbers');
    });
  });

  describe('clearProducts', () => {
    beforeEach(() => {
      order.addProduct(product1);
      order.addProduct(product2);
    });

    it('should clear all products', () => {
      order.clearProducts();

      expect(order.productCount).toBe(0);
      expect(order.isEmpty()).toBe(true);
    });

    it('should touch the entity when clearing products', () => {
      order.clearProducts();
      expect(order.productCount).toBe(0);
    });
  });

  describe('createWithProducts', () => {
    it('should create order with products', () => {
      const createdOrder = Order.createWithProducts('ORDER003', [
        product1,
        product2,
      ]);

      expect(createdOrder.orderId).toBe('ORDER003');
      expect(createdOrder.productCount).toBe(2);
      expect(createdOrder.products).toContain(product1);
      expect(createdOrder.products).toContain(product2);
    });
  });

  describe('toString', () => {
    it('should return formatted string representation', () => {
      order.addProduct(product1);
      const result = order.toString();

      expect(result).toContain('ORDER001');
      expect(result).toContain('1 products');
      expect(result).toContain('volume: 6000.00');
    });
  });
});
