import { Box } from './box.entity';
import { Dimensions } from '../value-objects/dimensions.vo';
import { BoxType } from '../enums/box-type.enum';
import { Product } from './product.entity';

describe('Box', () => {
  let validDimensions: Dimensions;
  let box: Box;
  let product: Product;

  beforeEach(() => {
    validDimensions = new Dimensions(50, 50, 40);
    box = new Box('BOX001', BoxType.CAIXA_2, validDimensions);
    product = new Product('PROD001', new Dimensions(10, 20, 30));
  });

  describe('constructor', () => {
    it('should create a box with valid parameters', () => {
      expect(box.boxId).toBe('BOX001');
      expect(box.boxType).toBe(BoxType.CAIXA_2);
      expect(box.dimensions).toBe(validDimensions);
      expect(box.isActive).toBe(true);
    });

    it('should create inactive box when specified', () => {
      const inactiveBox = new Box(
        'BOX002',
        BoxType.CAIXA_1,
        validDimensions,
        false,
      );
      expect(inactiveBox.isActive).toBe(false);
    });

    it('should throw error for empty box ID', () => {
      expect(() => new Box('', BoxType.CAIXA_1, validDimensions)).toThrow(
        'Box ID cannot be empty',
      );
    });

    it('should throw error for null box type', () => {
      expect(() => new Box('BOX001', null as any, validDimensions)).toThrow(
        'Box type cannot be null or undefined',
      );
    });

    it('should throw error for null dimensions', () => {
      expect(() => new Box('BOX001', BoxType.CAIXA_1, null as any)).toThrow(
        'Dimensions cannot be null or undefined',
      );
    });

    it('should trim box ID', () => {
      const boxWithSpaces = new Box(
        '  BOX001  ',
        BoxType.CAIXA_1,
        validDimensions,
      );
      expect(boxWithSpaces.boxId).toBe('BOX001');
    });
  });

  describe('getters', () => {
    it('should return correct dimensions properties', () => {
      expect(box.height).toBe(50);
      expect(box.width).toBe(50);
      expect(box.length).toBe(40);
    });

    it('should return the dimensions object', () => {
      expect(box.dimensions).toBe(validDimensions);
    });
  });

  describe('getVolume', () => {
    it('should return correct volume', () => {
      expect(box.getVolume()).toBe(100000);
    });
  });

  describe('canFitProduct', () => {
    it('should return true when product fits in box', () => {
      expect(box.canFitProduct(product)).toBe(true);
    });

    it('should return false when product does not fit in box', () => {
      const largeProduct = new Product('LARGE', new Dimensions(60, 60, 50));
      expect(box.canFitProduct(largeProduct)).toBe(false);
    });
  });

  describe('canFitProducts', () => {
    it('should return true for empty product list', () => {
      expect(box.canFitProducts([])).toBe(true);
    });

    it('should return true for single product that fits', () => {
      expect(box.canFitProducts([product])).toBe(true);
    });

    it('should return false for single product that does not fit', () => {
      const largeProduct = new Product('LARGE', new Dimensions(60, 60, 50));
      expect(box.canFitProducts([largeProduct])).toBe(false);
    });

    it('should return true for multiple products with total volume under limit', () => {
      const products = [
        new Product('PROD1', new Dimensions(10, 10, 10)),
        new Product('PROD2', new Dimensions(15, 15, 15)),
        new Product('PROD3', new Dimensions(20, 20, 20)),
      ];
      expect(box.canFitProducts(products)).toBe(true);
    });

    it('should return false for multiple products exceeding volume limit', () => {
      const products = [
        new Product('PROD1', new Dimensions(30, 30, 30)),
        new Product('PROD2', new Dimensions(30, 30, 30)),
        new Product('PROD3', new Dimensions(30, 30, 30)),
      ];
      expect(box.canFitProducts(products)).toBe(false);
    });
  });

  describe('getBestFitRotationForProduct', () => {
    it('should return best fit rotation when product fits', () => {
      const bestFit = box.getBestFitRotationForProduct(product);

      expect(bestFit).not.toBeNull();
      expect(bestFit!.canFitInside(box.dimensions)).toBe(true);
    });

    it('should return null when product does not fit', () => {
      const largeProduct = new Product('LARGE', new Dimensions(60, 60, 50));
      const bestFit = box.getBestFitRotationForProduct(largeProduct);

      expect(bestFit).toBeNull();
    });
  });

  describe('calculateSpaceUtilization', () => {
    it('should return 0 for empty product list', () => {
      expect(box.calculateSpaceUtilization([])).toBe(0);
    });

    it('should return correct utilization for single product', () => {
      const utilization = box.calculateSpaceUtilization([product]);
      const expectedUtilization = product.getVolume() / box.getVolume();
      expect(utilization).toBeCloseTo(expectedUtilization, 5);
    });

    it('should return 1.0 for products exceeding box volume', () => {
      const largeProduct = new Product('LARGE', new Dimensions(60, 60, 50));
      const utilization = box.calculateSpaceUtilization([largeProduct]);
      expect(utilization).toBe(1.0);
    });
  });

  describe('activate', () => {
    it('should activate the box and touch the entity', () => {
      const inactiveBox = new Box(
        'BOX002',
        BoxType.CAIXA_1,
        validDimensions,
        false,
      );
      inactiveBox.activate();

      expect(inactiveBox.isActive).toBe(true);
    });
  });

  describe('deactivate', () => {
    it('should deactivate the box and touch the entity', () => {
      box.deactivate();

      expect(box.isActive).toBe(false);
    });
  });

  describe('createFromType', () => {
    it('should create box from BoxType enum', () => {
      const createdBox = Box.createFromType(BoxType.CAIXA_1);

      expect(createdBox.boxId).toBe(BoxType.CAIXA_1);
      expect(createdBox.boxType).toBe(BoxType.CAIXA_1);
      expect(createdBox.isActive).toBe(true);
      expect(createdBox.height).toBe(30);
      expect(createdBox.width).toBe(40);
      expect(createdBox.length).toBe(80);
    });

    it('should create inactive box when specified', () => {
      const createdBox = Box.createFromType(BoxType.CAIXA_2, false);
      expect(createdBox.isActive).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return formatted string representation', () => {
      const result = box.toString();
      expect(result).toBe('Box(BOX001: 50 x 50 x 40, active: true)');
    });

    it('should show inactive status', () => {
      const inactiveBox = new Box(
        'BOX002',
        BoxType.CAIXA_1,
        validDimensions,
        false,
      );
      const result = inactiveBox.toString();
      expect(result).toBe('Box(BOX002: 50 x 50 x 40, active: false)');
    });
  });
});
