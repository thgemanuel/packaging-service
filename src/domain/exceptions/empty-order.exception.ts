import { DomainException } from './domain.exception';

export class EmptyOrderException extends DomainException {
  constructor(orderId?: string) {
    const message = orderId
      ? `Order '${orderId}' cannot be empty - at least one product is required`
      : 'Order cannot be empty - at least one product is required';

    super([message]);
    this.name = 'EmptyOrderException';
  }
}
