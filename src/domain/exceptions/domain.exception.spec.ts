import {
  DomainException,
  resolveRecursivelyMessages,
} from './domain.exception';
import { ValidationError } from 'class-validator';

describe('DomainException', () => {
  describe('constructor', () => {
    it('should create exception with single error message', () => {
      const errors = ['Test error message'];
      const exception = new DomainException(errors);

      expect(exception.message).toBe('Test error message');
      expect(exception.name).toBe('DomainException');
      expect(exception.getErrors()).toEqual(errors);
    });

    it('should create exception with multiple error messages', () => {
      const errors = ['First error', 'Second error', 'Third error'];
      const exception = new DomainException(errors);

      expect(exception.message).toBe('First error, Second error, Third error');
      expect(exception.name).toBe('DomainException');
      expect(exception.getErrors()).toEqual(errors);
    });

    it('should create exception with empty error array', () => {
      const errors: string[] = [];
      const exception = new DomainException(errors);

      expect(exception.message).toBe('');
      expect(exception.name).toBe('DomainException');
      expect(exception.getErrors()).toEqual(errors);
    });
  });

  describe('getErrors', () => {
    it('should return the original errors array', () => {
      const errors = ['Error 1', 'Error 2'];
      const exception = new DomainException(errors);

      const returnedErrors = exception.getErrors();
      expect(returnedErrors).toBe(errors); // Should be the same reference
    });
  });
});

describe('resolveRecursivelyMessages', () => {
  it('should resolve messages for simple validation error', () => {
    const error: ValidationError = {
      target: { constructor: { name: 'TestClass' } },
      property: 'testProperty',
      constraints: {
        isNotEmpty: 'should not be empty',
        isString: 'must be a string',
      },
      children: [],
    };

    const errorList: string[] = [];
    resolveRecursivelyMessages(error, errorList);

    expect(errorList).toHaveLength(1);
    expect(errorList[0]).toContain(
      'TestClass has following errors: [should not be empty, must be a string]',
    );
  });

  it('should resolve messages for validation error with children', () => {
    const childError: ValidationError = {
      target: { constructor: { name: 'ChildClass' } },
      property: 'childProperty',
      constraints: {
        isNumber: 'must be a number',
      },
      children: [],
    };

    const parentError: ValidationError = {
      target: { constructor: { name: 'ParentClass' } },
      property: 'parentProperty',
      constraints: {},
      children: [childError],
    };

    const errorList: string[] = [];
    resolveRecursivelyMessages(parentError, errorList);

    expect(errorList).toHaveLength(1);
    expect(errorList[0]).toContain(
      'ChildClass has following errors: [must be a number]',
    );
  });

  it('should handle validation error with no constraints', () => {
    const error: ValidationError = {
      target: { constructor: { name: 'TestClass' } },
      property: 'testProperty',
      constraints: {},
      children: [],
    };

    const errorList: string[] = [];
    resolveRecursivelyMessages(error, errorList);

    expect(errorList).toHaveLength(1);
    expect(errorList[0]).toContain('TestClass has following errors: []');
  });

  it('should handle validation error with undefined children', () => {
    const error: ValidationError = {
      target: { constructor: { name: 'TestClass' } },
      property: 'testProperty',
      constraints: {
        isNotEmpty: 'should not be empty',
      },
      children: undefined,
    };

    const errorList: string[] = [];
    resolveRecursivelyMessages(error, errorList);

    expect(errorList).toHaveLength(1);
    expect(errorList[0]).toContain(
      'TestClass has following errors: [should not be empty]',
    );
  });
});
