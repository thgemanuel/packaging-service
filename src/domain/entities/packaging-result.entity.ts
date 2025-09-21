import { AbstractEntity } from './abstract.entity';
import { Product } from './product.entity';
import { Box } from './box.entity';
import { BoxType } from '../enums/box-type.enum';
import { InvalidDimensionsException } from '../exceptions/invalid-dimensions.exception';

export interface PackagedProduct {
  productId: string;
  originalDimensions: {
    height: number;
    width: number;
    length: number;
  };
  rotatedDimensions?: {
    height: number;
    width: number;
    length: number;
  };
}

export class PackagingResult extends AbstractEntity {
  private _orderId: string;
  private _box: Box | null;
  private _boxType: BoxType | null;
  private _products: PackagedProduct[];
  private _observation: string | null;
  private _spaceUtilization: number;

  constructor(
    orderId: string,
    box: Box | null = null,
    products: PackagedProduct[] = [],
    observation: string | null = null,
  ) {
    super();
    this.setOrderId(orderId);
    this._box = box;
    this._boxType = box?.boxType || null;
    this.setProducts(products);
    this._observation = observation;
    this._spaceUtilization = this.calculateSpaceUtilization();
  }

  get orderId(): string {
    return this._orderId;
  }

  get box(): Box | null {
    return this._box;
  }

  get boxType(): BoxType | null {
    return this._boxType;
  }

  get boxId(): string | null {
    return this._box?.boxId || null;
  }

  get products(): PackagedProduct[] {
    return [...this._products];
  }

  get observation(): string | null {
    return this._observation;
  }

  get spaceUtilization(): number {
    return this._spaceUtilization;
  }

  get productCount(): number {
    return this._products.length;
  }

  /**
   * Check if this result represents products that don't fit in any box
   */
  isUnpackable(): boolean {
    return this._box === null;
  }

  /**
   * Check if this result is successful (has a box)
   */
  isSuccessful(): boolean {
    return this._box !== null && this._products.length > 0;
  }

  /**
   * Get total volume of all products in this result
   */
  getTotalProductVolume(): number {
    return this._products.reduce((total, product) => {
      const dims = product.originalDimensions;
      return total + dims.height * dims.width * dims.length;
    }, 0);
  }

  /**
   * Get box volume (0 if no box)
   */
  getBoxVolume(): number {
    return this._box?.getVolume() || 0;
  }

  /**
   * Add a product to this packaging result
   */
  addProduct(
    product: Product,
    rotatedDimensions?: { height: number; width: number; length: number },
  ): void {
    const packagedProduct: PackagedProduct = {
      productId: product.productId,
      originalDimensions: {
        height: product.height,
        width: product.width,
        length: product.length,
      },
      rotatedDimensions,
    };

    this._products.push(packagedProduct);
    this._spaceUtilization = this.calculateSpaceUtilization();
    this.touch();
  }

  /**
   * Set observation for this result
   */
  setObservation(observation: string | null): void {
    this._observation = observation;
    this.touch();
  }

  /**
   * Update the box for this result
   */
  setBox(box: Box | null): void {
    this._box = box;
    this._boxType = box?.boxType || null;
    this._spaceUtilization = this.calculateSpaceUtilization();
    this.touch();
  }

  /**
   * Calculate space utilization percentage
   */
  private calculateSpaceUtilization(): number {
    if (!this._box || this._products.length === 0) {
      return 0;
    }

    const totalProductVolume = this.getTotalProductVolume();
    const boxVolume = this.getBoxVolume();

    return boxVolume > 0 ? Math.min(totalProductVolume / boxVolume, 1.0) : 0;
  }

  /**
   * Get efficiency rating based on space utilization
   */
  getEfficiencyRating(): 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'UNPACKABLE' {
    if (this.isUnpackable()) return 'UNPACKABLE';

    if (this._spaceUtilization >= 0.8) return 'EXCELLENT';
    if (this._spaceUtilization >= 0.6) return 'GOOD';
    if (this._spaceUtilization >= 0.4) return 'FAIR';
    return 'POOR';
  }

  private setOrderId(orderId: string): void {
    if (!orderId || orderId.trim().length === 0) {
      throw new InvalidDimensionsException('Order ID cannot be empty');
    }
    this._orderId = orderId.trim();
  }

  private setProducts(products: PackagedProduct[]): void {
    if (!products) {
      this._products = [];
      return;
    }

    const productIds = products.map((p) => p.productId);
    const uniqueProductIds = new Set(productIds);

    if (productIds.length !== uniqueProductIds.size) {
      throw new InvalidDimensionsException(
        'Packaging result cannot contain duplicate products',
      );
    }

    this._products = [...products];
  }

  /**
   * Create a successful packaging result
   */
  static createSuccessful(
    orderId: string,
    box: Box,
    products: Product[],
  ): PackagingResult {
    const result = new PackagingResult(orderId, box);
    products.forEach((product) => {
      const bestRotation = box.getBestFitRotationForProduct(product);
      result.addProduct(
        product,
        bestRotation
          ? {
              height: bestRotation.height,
              width: bestRotation.width,
              length: bestRotation.length,
            }
          : undefined,
      );
    });
    return result;
  }

  /**
   * Create a failed packaging result (products don't fit)
   */
  static createFailed(
    orderId: string,
    products: Product[],
    observation: string,
  ): PackagingResult {
    const result = new PackagingResult(orderId, null, [], observation);
    products.forEach((product) => result.addProduct(product));
    return result;
  }

  /**
   * Convert to JSON for storage
   */
  toJSON(): any {
    return {
      orderId: this._orderId,
      boxId: this.boxId,
      boxType: this._boxType,
      products: this._products,
      observation: this._observation,
      spaceUtilization: this._spaceUtilization,
      efficiency: this.getEfficiencyRating(),
    };
  }

  /**
   * String representation
   */
  toString(): string {
    const boxInfo = this._box ? `${this._box.boxId}` : 'NO BOX';
    const efficiency = this.getEfficiencyRating();
    return `PackagingResult(${this._orderId} -> ${boxInfo}, ${this._products.length} products, ${efficiency})`;
  }
}
