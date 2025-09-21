import { EmptyOrderException } from './empty-order.exception';

describe('EmptyOrderException', () => {
  describe('constructor', () => {
    it('should create exception with order ID', () => {
      const exception = new EmptyOrderException('ORDER001');

      expect(exception.message).toBe(
        "Order 'ORDER001' cannot be empty - at least one product is required",
      );
      expect(exception.name).toBe('EmptyOrderException');
      expect(exception.getErrors()).toEqual([
        "Order 'ORDER001' cannot be empty - at least one product is required",
      ]);
    });

    it('should create exception without order ID', () => {
      const exception = new EmptyOrderException();

      expect(exception.message).toBe(
        'Order cannot be empty - at least one product is required',
      );
      expect(exception.name).toBe('EmptyOrderException');
      expect(exception.getErrors()).toEqual([
        'Order cannot be empty - at least one product is required',
      ]);
    });

    it('should create exception with undefined order ID', () => {
      const exception = new EmptyOrderException(undefined);

      expect(exception.message).toBe(
        'Order cannot be empty - at least one product is required',
      );
      expect(exception.name).toBe('EmptyOrderException');
    });

    it('should create exception with empty string order ID', () => {
      const exception = new EmptyOrderException('');

      expect(exception.message).toBe(
        'Order cannot be empty - at least one product is required',
      );
      expect(exception.name).toBe('EmptyOrderException');
    });
  });

  describe('inheritance', () => {
    it('should be instance of DomainException', () => {
      const exception = new EmptyOrderException('ORDER001');
      expect(exception).toBeInstanceOf(Error);
    });

    it('should have correct error structure', () => {
      const exception = new EmptyOrderException('ORDER001');
      const errors = exception.getErrors();

      expect(errors).toHaveLength(1);
      expect(errors[0]).toContain('ORDER001');
      expect(errors[0]).toContain('cannot be empty');
    });
  });
});
