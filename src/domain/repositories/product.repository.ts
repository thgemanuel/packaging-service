import { Product } from '../entities/product.entity';

export interface ProductRepository {
  findByProductId(productId: string): Promise<Product | null>;
  save(product: Product): Promise<Product>;
  saveMany(products: Product[]): Promise<Product[]>;
  upsert(product: Product): Promise<Product>;
  upsertMany(products: Product[]): Promise<Product[]>;
}

export const PRODUCT_REPOSITORY_NAME = 'ProductRepository';
