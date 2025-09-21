import { AbstractEntity } from './abstract.entity';
import { Product } from './product.entity';
import { EmptyOrderException } from '../exceptions/empty-order.exception';
import { InvalidDimensionsException } from '../exceptions/invalid-dimensions.exception';

export class Order extends AbstractEntity {
  private _orderId: string;
  private _products: Product[];

  constructor(orderId: string, products: Product[] = []) {
    super();
    this.setOrderId(orderId);
    this.setProducts(products);
  }

  get orderId(): string {
    return this._orderId;
  }

  get products(): Product[] {
    return [...this._products]; // Return a copy to prevent external modification
  }

  get productCount(): number {
    return this._products.length;
  }

  /**
   * Check if the order is empty
   */
  isEmpty(): boolean {
    return this._products.length === 0;
  }

  /**
   * Get total volume of all products in the order
   */
  getTotalVolume(): number {
    return this._products.reduce((total, product) => total + product.getVolume(), 0);
  }

  /**
   * Add a product to the order
   */
  addProduct(product: Product): void {
    if (!product) {
      throw new InvalidDimensionsException('Product cannot be null or undefined');
    }

    // Check if product already exists
    const existingProduct = this._products.find(p => p.productId === product.productId);
    if (existingProduct) {
      throw new InvalidDimensionsException(`Product '${product.productId}' already exists in order '${this._orderId}'`);
    }

    this._products.push(product);
    this.touch();
  }

  /**
   * Remove a product from the order
   */
  removeProduct(productId: string): boolean {
    const initialLength = this._products.length;
    this._products = this._products.filter(p => p.productId !== productId);
    
    if (this._products.length < initialLength) {
      this.touch();
      return true;
    }
    
    return false;
  }

  /**
   * Get a product by its ID
   */
  getProduct(productId: string): Product | undefined {
    return this._products.find(p => p.productId === productId);
  }

  /**
   * Check if a product exists in the order
   */
  hasProduct(productId: string): boolean {
    return this._products.some(p => p.productId === productId);
  }

  /**
   * Get products sorted by volume (descending - largest first)
   * This is useful for packing algorithms
   */
  getProductsSortedByVolume(): Product[] {
    return [...this._products].sort((a, b) => b.getVolume() - a.getVolume());
  }

  /**
   * Get products sorted by a specific dimension
   */
  getProductsSortedByDimension(dimension: 'height' | 'width' | 'length'): Product[] {
    return [...this._products].sort((a, b) => b[dimension] - a[dimension]);
  }

  /**
   * Validate that the order can be processed
   */
  validateForProcessing(): void {
    if (this.isEmpty()) {
      throw new EmptyOrderException(this._orderId);
    }

    // Validate each product
    this._products.forEach(product => {
      if (product.getVolume() <= 0) {
        throw new InvalidDimensionsException(
          'Product has invalid dimensions (volume must be positive)',
          product.productId
        );
      }
    });
  }

  /**
   * Clear all products from the order
   */
  clearProducts(): void {
    this._products = [];
    this.touch();
  }

  private setOrderId(orderId: string): void {
    if (!orderId || orderId.trim().length === 0) {
      throw new InvalidDimensionsException('Order ID cannot be empty');
    }
    this._orderId = orderId.trim();
  }

  private setProducts(products: Product[]): void {
    if (!products) {
      this._products = [];
      return;
    }

    // Validate no duplicate product IDs
    const productIds = products.map(p => p.productId);
    const uniqueProductIds = new Set(productIds);
    
    if (productIds.length !== uniqueProductIds.size) {
      throw new InvalidDimensionsException('Order cannot contain duplicate products');
    }

    this._products = [...products];
  }

  /**
   * Create an order with products
   */
  static createWithProducts(orderId: string, products: Product[]): Order {
    const order = new Order(orderId);
    products.forEach(product => order.addProduct(product));
    return order;
  }

  /**
   * String representation
   */
  toString(): string {
    return `Order(${this._orderId}: ${this._products.length} products, volume: ${this.getTotalVolume().toFixed(2)})`;
  }
}
