import { AbstractEntity } from './abstract.entity';
import { Dimensions } from '../value-objects/dimensions.vo';
import { BoxType } from '../enums/box-type.enum';
import { Product } from './product.entity';
import { InvalidDimensionsException } from '../exceptions/invalid-dimensions.exception';

export class Box extends AbstractEntity {
  private _boxId: string;
  private _boxType: BoxType;
  private _dimensions: Dimensions;
  private _isActive: boolean;

  constructor(
    boxId: string,
    boxType: BoxType,
    dimensions: Dimensions,
    isActive: boolean = true,
  ) {
    super();
    this.setBoxId(boxId);
    this.setBoxType(boxType);
    this.setDimensions(dimensions);
    this._isActive = isActive;
  }

  get boxId(): string {
    return this._boxId;
  }

  get boxType(): BoxType {
    return this._boxType;
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

  get isActive(): boolean {
    return this._isActive;
  }

  /**
   * Get the volume of the box
   */
  getVolume(): number {
    return this._dimensions.getVolume();
  }

  /**
   * Check if a product can fit inside this box
   */
  canFitProduct(product: Product): boolean {
    return product.canFitInside(this._dimensions);
  }

  /**
   * Check if multiple products can fit inside this box
   * This is a simplified check - in reality, you'd need a more complex packing algorithm
   */
  canFitProducts(products: Product[]): boolean {
    if (products.length === 0) return true;
    if (products.length === 1) return this.canFitProduct(products[0]);

    const totalProductVolume = products.reduce(
      (sum, product) => sum + product.getVolume(),
      0,
    );
    const boxVolume = this.getVolume();

    return totalProductVolume <= boxVolume * 0.8;
  }

  /**
   * Get the best fit rotation for a product in this box
   */
  getBestFitRotationForProduct(product: Product): Dimensions | null {
    return product.getBestFitRotation(this._dimensions);
  }

  /**
   * Calculate space utilization for given products
   */
  calculateSpaceUtilization(products: Product[]): number {
    if (products.length === 0) return 0;

    const totalProductVolume = products.reduce(
      (sum, product) => sum + product.getVolume(),
      0,
    );
    const boxVolume = this.getVolume();

    return Math.min(totalProductVolume / boxVolume, 1.0);
  }

  /**
   * Activate the box
   */
  activate(): void {
    this._isActive = true;
    this.touch();
  }

  /**
   * Deactivate the box
   */
  deactivate(): void {
    this._isActive = false;
    this.touch();
  }

  private setBoxId(boxId: string): void {
    if (!boxId || boxId.trim().length === 0) {
      throw new InvalidDimensionsException('Box ID cannot be empty');
    }
    this._boxId = boxId.trim();
  }

  private setBoxType(boxType: BoxType): void {
    if (!boxType) {
      throw new InvalidDimensionsException(
        'Box type cannot be null or undefined',
      );
    }
    this._boxType = boxType;
  }

  private setDimensions(dimensions: Dimensions): void {
    if (!dimensions) {
      throw new InvalidDimensionsException(
        'Dimensions cannot be null or undefined',
        this._boxId,
      );
    }
    this._dimensions = dimensions;
  }

  /**
   * Create a box from BoxType enum
   */
  static createFromType(boxType: BoxType, isActive: boolean = true): Box {
    const dimensions = BoxTypeHelper.getDimensions(boxType);
    return new Box(boxType, boxType, dimensions, isActive);
  }

  /**
   * String representation
   */
  toString(): string {
    return `Box(${this._boxId}: ${this._dimensions.toString()}, active: ${this._isActive})`;
  }
}

import { BoxTypeHelper } from '../enums/box-type.enum';
