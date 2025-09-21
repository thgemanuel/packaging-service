import { InvalidDimensionsException } from './invalid-dimensions.exception';

describe('InvalidDimensionsException', () => {
  describe('constructor', () => {
    it('should create exception with product ID', () => {
      const exception = new InvalidDimensionsException(
        'negative values not allowed',
        'PROD001',
      );

      expect(exception.message).toBe(
        "Invalid dimensions for product 'PROD001': negative values not allowed",
      );
      expect(exception.name).toBe('InvalidDimensionsException');
      expect(exception.getErrors()).toEqual([
        "Invalid dimensions for product 'PROD001': negative values not allowed",
      ]);
    });

    it('should create exception without product ID', () => {
      const exception = new InvalidDimensionsException(
        'dimensions must be positive',
      );

      expect(exception.message).toBe(
        'Invalid dimensions: dimensions must be positive',
      );
      expect(exception.name).toBe('InvalidDimensionsException');
      expect(exception.getErrors()).toEqual([
        'Invalid dimensions: dimensions must be positive',
      ]);
    });

    it('should create exception with undefined product ID', () => {
      const exception = new InvalidDimensionsException(
        'invalid format',
        undefined,
      );

      expect(exception.message).toBe('Invalid dimensions: invalid format');
      expect(exception.name).toBe('InvalidDimensionsException');
    });

    it('should create exception with empty string product ID', () => {
      const exception = new InvalidDimensionsException('invalid format', '');

      expect(exception.message).toBe('Invalid dimensions: invalid format');
      expect(exception.name).toBe('InvalidDimensionsException');
    });
  });

  describe('inheritance', () => {
    it('should be instance of Error', () => {
      const exception = new InvalidDimensionsException(
        'test reason',
        'PROD001',
      );
      expect(exception).toBeInstanceOf(Error);
    });

    it('should have correct error structure', () => {
      const exception = new InvalidDimensionsException(
        'test reason',
        'PROD001',
      );
      const errors = exception.getErrors();

      expect(errors).toHaveLength(1);
      expect(errors[0]).toContain('PROD001');
      expect(errors[0]).toContain('test reason');
    });
  });

  describe('message formatting', () => {
    it('should format message correctly with product ID', () => {
      const exception = new InvalidDimensionsException(
        'height must be greater than 0',
        'PROD123',
      );

      expect(exception.message).toBe(
        "Invalid dimensions for product 'PROD123': height must be greater than 0",
      );
    });

    it('should format message correctly without product ID', () => {
      const exception = new InvalidDimensionsException(
        'all dimensions must be finite numbers',
      );

      expect(exception.message).toBe(
        'Invalid dimensions: all dimensions must be finite numbers',
      );
    });

    it('should handle special characters in product ID', () => {
      const exception = new InvalidDimensionsException(
        'test reason',
        'PROD-001_SPECIAL',
      );

      expect(exception.message).toBe(
        "Invalid dimensions for product 'PROD-001_SPECIAL': test reason",
      );
    });
  });
});
