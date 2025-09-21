import { Product } from './product.entity';
import { Dimensions } from '../value-objects/dimensions.vo';

describe('Product', () => {
  let validDimensions: Dimensions;
  let product: Product;

  beforeEach(() => {
    validDimensions = new Dimensions(10, 20, 30);
    product = new Product('PROD001', validDimensions);
  });

  describe('constructor', () => {
    it('should create a product with valid parameters', () => {
      expect(product.productId).toBe('PROD001');
      expect(product.dimensions).toBe(validDimensions);
      expect(product.height).toBe(10);
      expect(product.width).toBe(20);
      expect(product.length).toBe(30);
    });

    it('should throw error for empty product ID', () => {
      expect(() => new Product('', validDimensions)).toThrow(
        'Product ID cannot be empty',
      );
    });

    it('should throw error for whitespace-only product ID', () => {
      expect(() => new Product('   ', validDimensions)).toThrow(
        'Product ID cannot be empty',
      );
    });

    it('should throw error for null dimensions', () => {
      expect(() => new Product('PROD001', null as any)).toThrow(
        'Dimensions cannot be null or undefined',
      );
    });

    it('should trim product ID', () => {
      const productWithSpaces = new Product('  PROD001  ', validDimensions);
      expect(productWithSpaces.productId).toBe('PROD001');
    });
  });

  describe('getters', () => {
    it('should return correct dimensions properties', () => {
      expect(product.height).toBe(10);
      expect(product.width).toBe(20);
      expect(product.length).toBe(30);
    });

    it('should return the dimensions object', () => {
      expect(product.dimensions).toBe(validDimensions);
    });
  });

  describe('getVolume', () => {
    it('should return correct volume', () => {
      expect(product.getVolume()).toBe(6000);
    });
  });

  describe('canFitInside', () => {
    it('should return true when product fits in container', () => {
      const container = new Dimensions(15, 25, 35);
      expect(product.canFitInside(container)).toBe(true);
    });

    it('should return false when product does not fit in container', () => {
      const container = new Dimensions(5, 15, 25);
      expect(product.canFitInside(container)).toBe(false);
    });
  });

  describe('getBestFitRotation', () => {
    it('should return best fit rotation when product fits', () => {
      const container = new Dimensions(15, 25, 35);
      const bestFit = product.getBestFitRotation(container);

      expect(bestFit).not.toBeNull();
      expect(bestFit!.canFitInside(container)).toBe(true);
    });

    it('should return null when product does not fit', () => {
      const container = new Dimensions(5, 5, 5);
      const bestFit = product.getBestFitRotation(container);

      expect(bestFit).toBeNull();
    });
  });

  describe('updateDimensions', () => {
    it('should update dimensions and touch the entity', () => {
      const newDimensions = new Dimensions(15, 25, 35);
      product.updateDimensions(newDimensions);

      expect(product.dimensions).toBe(newDimensions);
    });

    it('should throw error for null dimensions', () => {
      expect(() => product.updateDimensions(null as any)).toThrow(
        'Dimensions cannot be null or undefined',
      );
    });
  });

  describe('create', () => {
    it('should create product from basic parameters', () => {
      const createdProduct = Product.create('PROD002', 15, 25, 35);

      expect(createdProduct.productId).toBe('PROD002');
      expect(createdProduct.height).toBe(15);
      expect(createdProduct.width).toBe(25);
      expect(createdProduct.length).toBe(35);
    });

    it('should throw error for invalid dimensions in create', () => {
      expect(() => Product.create('PROD002', -1, 25, 35)).toThrow(
        'All dimensions must be positive numbers',
      );
    });
  });

  describe('toString', () => {
    it('should return formatted string representation', () => {
      const result = product.toString();
      expect(result).toBe('Product(PROD001: 10 x 20 x 30)');
    });
  });
});
