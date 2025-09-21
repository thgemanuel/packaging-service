import { DomainException } from './domain.exception';

export class InvalidDimensionsException extends DomainException {
  constructor(reason: string, productId?: string) {
    const message = productId
      ? `Invalid dimensions for product '${productId}': ${reason}`
      : `Invalid dimensions: ${reason}`;

    super([message]);
    this.name = 'InvalidDimensionsException';
  }
}
