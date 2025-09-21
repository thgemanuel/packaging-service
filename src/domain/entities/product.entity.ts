import { AbstractEntity } from './abstract.entity';
import { Dimensions } from '../value-objects/dimensions.vo';
import { InvalidDimensionsException } from '../exceptions/invalid-dimensions.exception';

export class Product extends AbstractEntity {
  private _productId: string;
  private _dimensions: Dimensions;

  constructor(productId: string, dimensions: Dimensions) {
    super();
    this.setProductId(productId);
    this.setDimensions(dimensions);
  }

  get productId(): string {
    return this._productId;
  }

  get dimensions(): Dimensions {
    return this._dimensions;
  }

  get height(): number {
    return this._dimensions.height;
  }

  get width(): number {
    return this._dimensions.width;
  }

  get length(): number {
    return this._dimensions.length;
  }

  /**
   * Get the volume of the product
   */
  getVolume(): number {
    return this._dimensions.getVolume();
  }

  /**
   * Check if this product can fit inside a container with given dimensions
   */
  canFitInside(containerDimensions: Dimensions): boolean {
    return this._dimensions.canFitInside(containerDimensions);
  }

  /**
   * Get the best rotation that fits inside a container
   */
  getBestFitRotation(containerDimensions: Dimensions): Dimensions | null {
    return this._dimensions.getBestFitRotation(containerDimensions);
  }

  /**
   * Update product dimensions
   */
  updateDimensions(dimensions: Dimensions): void {
    this.setDimensions(dimensions);
    this.touch();
  }

  private setProductId(productId: string): void {
    if (!productId || productId.trim().length === 0) {
      throw new InvalidDimensionsException('Product ID cannot be empty');
    }
    this._productId = productId.trim();
  }

  private setDimensions(dimensions: Dimensions): void {
    if (!dimensions) {
      throw new InvalidDimensionsException('Dimensions cannot be null or undefined', this._productId);
    }
    this._dimensions = dimensions;
  }

  /**
   * Create a product from basic parameters
   */
  static create(productId: string, height: number, width: number, length: number): Product {
    const dimensions = new Dimensions(height, width, length);
    return new Product(productId, dimensions);
  }

  /**
   * String representation
   */
  toString(): string {
    return `Product(${this._productId}: ${this._dimensions.toString()})`;
  }
}
