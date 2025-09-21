import { Dimensions } from './dimensions.vo';

describe('Dimensions', () => {
  describe('constructor', () => {
    it('should create dimensions with valid values', () => {
      const dimensions = new Dimensions(10, 20, 30);

      expect(dimensions.height).toBe(10);
      expect(dimensions.width).toBe(20);
      expect(dimensions.length).toBe(30);
    });

    it('should throw error for negative height', () => {
      expect(() => new Dimensions(-1, 20, 30)).toThrow(
        'All dimensions must be positive numbers',
      );
    });

    it('should throw error for negative width', () => {
      expect(() => new Dimensions(10, -1, 30)).toThrow(
        'All dimensions must be positive numbers',
      );
    });

    it('should throw error for negative length', () => {
      expect(() => new Dimensions(10, 20, -1)).toThrow(
        'All dimensions must be positive numbers',
      );
    });

    it('should throw error for zero height', () => {
      expect(() => new Dimensions(0, 20, 30)).toThrow(
        'All dimensions must be positive numbers',
      );
    });

    it('should throw error for infinite values', () => {
      expect(() => new Dimensions(Infinity, 20, 30)).toThrow(
        'All dimensions must be finite numbers',
      );
      expect(() => new Dimensions(10, Infinity, 30)).toThrow(
        'All dimensions must be finite numbers',
      );
      expect(() => new Dimensions(10, 20, Infinity)).toThrow(
        'All dimensions must be finite numbers',
      );
    });

    it('should throw error for NaN values', () => {
      expect(() => new Dimensions(NaN, 20, 30)).toThrow(
        'All dimensions must be finite numbers',
      );
    });
  });

  describe('getVolume', () => {
    it('should calculate volume correctly', () => {
      const dimensions = new Dimensions(10, 20, 30);
      expect(dimensions.getVolume()).toBe(6000);
    });

    it('should calculate volume for decimal dimensions', () => {
      const dimensions = new Dimensions(10.5, 20.5, 30.5);
      expect(dimensions.getVolume()).toBe(10.5 * 20.5 * 30.5);
    });
  });

  describe('canFitInside', () => {
    it('should return true when dimensions fit exactly', () => {
      const small = new Dimensions(10, 20, 30);
      const large = new Dimensions(10, 20, 30);

      expect(small.canFitInside(large)).toBe(true);
    });

    it('should return true when dimensions fit with room to spare', () => {
      const small = new Dimensions(10, 20, 30);
      const large = new Dimensions(15, 25, 35);

      expect(small.canFitInside(large)).toBe(true);
    });

    it('should return false when dimensions do not fit', () => {
      const small = new Dimensions(10, 20, 30);
      const large = new Dimensions(5, 15, 25);

      expect(small.canFitInside(large)).toBe(false);
    });

    it('should return true when dimensions fit after rotation', () => {
      const small = new Dimensions(10, 20, 30);
      const large = new Dimensions(15, 25, 35);

      expect(small.canFitInside(large)).toBe(true);
    });

    it('should handle edge case where one dimension is too large', () => {
      const small = new Dimensions(10, 20, 30);
      const large = new Dimensions(5, 25, 35);

      expect(small.canFitInside(large)).toBe(false);
    });
  });

  describe('getAllRotations', () => {
    it('should return all possible rotations', () => {
      const dimensions = new Dimensions(10, 20, 30);
      const rotations = dimensions.getAllRotations();

      expect(rotations).toHaveLength(6);

      rotations.forEach((rotation) => {
        expect(rotation).toBeInstanceOf(Dimensions);
        expect(rotation.getVolume()).toBe(6000);
      });
    });

    it('should remove duplicate rotations for equal dimensions', () => {
      const dimensions = new Dimensions(10, 10, 10);
      const rotations = dimensions.getAllRotations();

      expect(rotations).toHaveLength(1);
    });

    it('should return unique rotations for different dimensions', () => {
      const dimensions = new Dimensions(10, 20, 30);
      const rotations = dimensions.getAllRotations();

      const uniqueRotations = new Set(
        rotations.map((r) => `${r.height}x${r.width}x${r.length}`),
      );

      expect(uniqueRotations.size).toBe(6);
    });
  });

  describe('getBestFitRotation', () => {
    it('should return null when no rotation fits', () => {
      const dimensions = new Dimensions(10, 20, 30);
      const container = new Dimensions(5, 5, 5);

      expect(dimensions.getBestFitRotation(container)).toBeNull();
    });

    it('should return the best fitting rotation', () => {
      const dimensions = new Dimensions(10, 20, 30);
      const container = new Dimensions(15, 25, 35);

      const bestFit = dimensions.getBestFitRotation(container);

      expect(bestFit).not.toBeNull();
      expect(bestFit!.canFitInside(container)).toBe(true);
    });

    it('should return the rotation with best volume utilization', () => {
      const dimensions = new Dimensions(10, 20, 30);
      const container = new Dimensions(15, 25, 35);

      const bestFit = dimensions.getBestFitRotation(container);

      expect(bestFit).not.toBeNull();
      expect(bestFit!.equals(dimensions)).toBe(true);
    });
  });

  describe('equals', () => {
    it('should return true for identical dimensions', () => {
      const dim1 = new Dimensions(10, 20, 30);
      const dim2 = new Dimensions(10, 20, 30);

      expect(dim1.equals(dim2)).toBe(true);
    });

    it('should return false for different dimensions', () => {
      const dim1 = new Dimensions(10, 20, 30);
      const dim2 = new Dimensions(10, 20, 31);

      expect(dim1.equals(dim2)).toBe(false);
    });

    it('should return false for different order dimensions', () => {
      const dim1 = new Dimensions(10, 20, 30);
      const dim2 = new Dimensions(20, 10, 30);

      expect(dim1.equals(dim2)).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return formatted string representation', () => {
      const dimensions = new Dimensions(10, 20, 30);
      expect(dimensions.toString()).toBe('10 x 20 x 30');
    });
  });

  describe('fromObject', () => {
    it('should create dimensions from object', () => {
      const obj = { height: 10, width: 20, length: 30 };
      const dimensions = Dimensions.fromObject(obj);

      expect(dimensions.height).toBe(10);
      expect(dimensions.width).toBe(20);
      expect(dimensions.length).toBe(30);
    });

    it('should throw error for invalid object values', () => {
      const obj = { height: -1, width: 20, length: 30 };

      expect(() => Dimensions.fromObject(obj)).toThrow(
        'All dimensions must be positive numbers',
      );
    });
  });
});
