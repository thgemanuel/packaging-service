import { BoxType, BoxTypeHelper } from './box-type.enum';
import { Dimensions } from '../value-objects/dimensions.vo';

describe('BoxType', () => {
  describe('enum values', () => {
    it('should have correct enum values', () => {
      expect(BoxType.CAIXA_1).toBe('Caixa 1');
      expect(BoxType.CAIXA_2).toBe('Caixa 2');
      expect(BoxType.CAIXA_3).toBe('Caixa 3');
    });
  });
});

describe('BoxTypeHelper', () => {
  describe('getDimensions', () => {
    it('should return correct dimensions for Caixa 1', () => {
      const dimensions = BoxTypeHelper.getDimensions(BoxType.CAIXA_1);

      expect(dimensions.height).toBe(30);
      expect(dimensions.width).toBe(40);
      expect(dimensions.length).toBe(80);
    });

    it('should return correct dimensions for Caixa 2', () => {
      const dimensions = BoxTypeHelper.getDimensions(BoxType.CAIXA_2);

      expect(dimensions.height).toBe(50);
      expect(dimensions.width).toBe(50);
      expect(dimensions.length).toBe(40);
    });

    it('should return correct dimensions for Caixa 3', () => {
      const dimensions = BoxTypeHelper.getDimensions(BoxType.CAIXA_3);

      expect(dimensions.height).toBe(50);
      expect(dimensions.width).toBe(80);
      expect(dimensions.length).toBe(60);
    });
  });

  describe('getAllBoxTypes', () => {
    it('should return all box types', () => {
      const boxTypes = BoxTypeHelper.getAllBoxTypes();

      expect(boxTypes).toHaveLength(3);
      expect(boxTypes).toContain(BoxType.CAIXA_1);
      expect(boxTypes).toContain(BoxType.CAIXA_2);
      expect(boxTypes).toContain(BoxType.CAIXA_3);
    });
  });

  describe('getAllBoxTypesWithDimensions', () => {
    it('should return all box types with their dimensions', () => {
      const boxTypesWithDimensions =
        BoxTypeHelper.getAllBoxTypesWithDimensions();

      expect(boxTypesWithDimensions).toHaveLength(3);

      const caixa1 = boxTypesWithDimensions.find(
        (b) => b.type === BoxType.CAIXA_1,
      );
      expect(caixa1).toBeDefined();
      expect(caixa1!.dimensions.height).toBe(30);
      expect(caixa1!.dimensions.width).toBe(40);
      expect(caixa1!.dimensions.length).toBe(80);
    });
  });

  describe('findBestBoxType', () => {
    it('should return the smallest box that fits the product', () => {
      const productDimensions = new Dimensions(25, 35, 70);
      const bestBox = BoxTypeHelper.findBestBoxType(productDimensions);

      expect(bestBox).toBe(BoxType.CAIXA_1);
    });

    it('should return Caixa 2 for medium-sized product', () => {
      const productDimensions = new Dimensions(45, 45, 35);
      const bestBox = BoxTypeHelper.findBestBoxType(productDimensions);

      expect(bestBox).toBe(BoxType.CAIXA_2);
    });

    it('should return Caixa 3 for large product', () => {
      const productDimensions = new Dimensions(45, 70, 50);
      const bestBox = BoxTypeHelper.findBestBoxType(productDimensions);

      expect(bestBox).toBe(BoxType.CAIXA_3);
    });

    it('should return null when product does not fit in any box', () => {
      const productDimensions = new Dimensions(100, 100, 100);
      const bestBox = BoxTypeHelper.findBestBoxType(productDimensions);

      expect(bestBox).toBeNull();
    });

    it('should consider rotations when finding best fit', () => {
      // Product that fits in Caixa 1 when rotated
      const productDimensions = new Dimensions(35, 25, 70);
      const bestBox = BoxTypeHelper.findBestBoxType(productDimensions);

      expect(bestBox).toBe(BoxType.CAIXA_1);
    });
  });

  describe('findCompatibleBoxTypes', () => {
    it('should return all boxes that can fit the product', () => {
      const productDimensions = new Dimensions(25, 35, 70);
      const compatibleBoxes =
        BoxTypeHelper.findCompatibleBoxTypes(productDimensions);

      expect(compatibleBoxes).toContain(BoxType.CAIXA_1);
      expect(compatibleBoxes).toContain(BoxType.CAIXA_3);
      // Caixa 2 (50x50x40) cannot fit this product (25x35x70) because 70 > 40
    });

    it('should return only larger boxes for big products', () => {
      const productDimensions = new Dimensions(45, 70, 50);
      const compatibleBoxes =
        BoxTypeHelper.findCompatibleBoxTypes(productDimensions);

      expect(compatibleBoxes).not.toContain(BoxType.CAIXA_1);
      expect(compatibleBoxes).not.toContain(BoxType.CAIXA_2);
      expect(compatibleBoxes).toContain(BoxType.CAIXA_3);
    });

    it('should return empty array when product fits in no box', () => {
      const productDimensions = new Dimensions(100, 100, 100);
      const compatibleBoxes =
        BoxTypeHelper.findCompatibleBoxTypes(productDimensions);

      expect(compatibleBoxes).toHaveLength(0);
    });

    it('should return boxes sorted by volume (smallest first)', () => {
      const productDimensions = new Dimensions(25, 35, 70);
      const compatibleBoxes =
        BoxTypeHelper.findCompatibleBoxTypes(productDimensions);

      expect(compatibleBoxes[0]).toBe(BoxType.CAIXA_1);
      expect(compatibleBoxes[1]).toBe(BoxType.CAIXA_3);
      // Caixa 2 is not included because it cannot fit this product
    });
  });

  describe('isValidBoxType', () => {
    it('should return true for valid box types', () => {
      expect(BoxTypeHelper.isValidBoxType('Caixa 1')).toBe(true);
      expect(BoxTypeHelper.isValidBoxType('Caixa 2')).toBe(true);
      expect(BoxTypeHelper.isValidBoxType('Caixa 3')).toBe(true);
    });

    it('should return false for invalid box types', () => {
      expect(BoxTypeHelper.isValidBoxType('Caixa 4')).toBe(false);
      expect(BoxTypeHelper.isValidBoxType('Invalid Box')).toBe(false);
      expect(BoxTypeHelper.isValidBoxType('')).toBe(false);
    });
  });

  describe('fromString', () => {
    it('should return box type for valid string', () => {
      expect(BoxTypeHelper.fromString('Caixa 1')).toBe(BoxType.CAIXA_1);
      expect(BoxTypeHelper.fromString('Caixa 2')).toBe(BoxType.CAIXA_2);
      expect(BoxTypeHelper.fromString('Caixa 3')).toBe(BoxType.CAIXA_3);
    });

    it('should return null for invalid string', () => {
      expect(BoxTypeHelper.fromString('Caixa 4')).toBeNull();
      expect(BoxTypeHelper.fromString('Invalid Box')).toBeNull();
      expect(BoxTypeHelper.fromString('')).toBeNull();
    });
  });
});
