import { EntityNotFoundException } from './entity-not-found.exception';

export class OrderNotFoundException extends EntityNotFoundException {
  constructor(orderId: string) {
    super(`Order with ID '${orderId}' was not found`);
    this.name = 'OrderNotFoundException';
  }
}
