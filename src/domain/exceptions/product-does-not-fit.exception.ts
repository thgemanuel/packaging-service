import { DomainException } from './domain.exception';

export class ProductDoesNotFitException extends DomainException {
  constructor(productId: string, availableBoxes?: string[]) {
    const message =
      availableBoxes && availableBoxes.length > 0
        ? `Product '${productId}' does not fit in any of the available boxes: ${availableBoxes.join(', ')}`
        : `Product '${productId}' does not fit in any available box`;

    super([message]);
    this.name = 'ProductDoesNotFitException';
  }
}
