import { Test, TestingModule } from '@nestjs/testing';
import { ProductMapper } from './product.mapper';
import { ProductTypeORM } from '../schemas/product.schema';
import { Product } from '@domain/entities/product.entity';
import { Dimensions } from '@domain/value-objects/dimensions.vo';

describe('ProductMapper', () => {
  let mapper: ProductMapper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductMapper],
    }).compile();

    mapper = module.get<ProductMapper>(ProductMapper);
  });

  describe('fromEntityToSchema', () => {
    it('should convert Product entity to ProductTypeORM schema', () => {
      const product = new Product('PROD001', new Dimensions(10, 20, 30));
      product.id = 'product-id';
      product.insertedAt = new Date('2023-01-01');
      product.updatedAt = new Date('2023-01-02');

      const result = mapper.fromEntityToSchema(product);

      expect(result).toBeInstanceOf(ProductTypeORM);
      expect(result.productId).toBe('PROD001');
      expect(result.height).toBe(10);
      expect(result.width).toBe(20);
      expect(result.length).toBe(30);
      expect(result.id).toBe('product-id');
      expect(result.insertedAt).toEqual(new Date('2023-01-01'));
      expect(result.updatedAt).toEqual(new Date('2023-01-02'));
    });

    it('should return null when product is null', () => {
      const result = mapper.fromEntityToSchema(null);

      expect(result).toBeNull();
    });

    it('should return null when product is undefined', () => {
      const result = mapper.fromEntityToSchema(undefined);

      expect(result).toBeNull();
    });
  });

  describe('fromSchemaToEntity', () => {
    it('should convert ProductTypeORM schema to Product entity', () => {
      const productSchema = new ProductTypeORM();
      productSchema.id = 'product-id';
      productSchema.productId = 'PROD001';
      productSchema.height = 10;
      productSchema.width = 20;
      productSchema.length = 30;
      productSchema.insertedAt = new Date('2023-01-01');
      productSchema.updatedAt = new Date('2023-01-02');

      const result = mapper.fromSchemaToEntity(productSchema);

      expect(result).toBeInstanceOf(Product);
      expect(result.productId).toBe('PROD001');
      expect(result.dimensions.height).toBe(10);
      expect(result.dimensions.width).toBe(20);
      expect(result.dimensions.length).toBe(30);
      expect(result.id).toBe('product-id');
      expect(result.insertedAt).toEqual(new Date('2023-01-01'));
      expect(result.updatedAt).toEqual(new Date('2023-01-02'));
    });

    it('should handle string dimensions correctly', () => {
      const productSchema = new ProductTypeORM();
      productSchema.id = 'product-id';
      productSchema.productId = 'PROD001';
      productSchema.height = '10' as any;
      productSchema.width = '20' as any;
      productSchema.length = '30' as any;
      productSchema.insertedAt = new Date('2023-01-01');
      productSchema.updatedAt = new Date('2023-01-02');

      const result = mapper.fromSchemaToEntity(productSchema);

      expect(result.dimensions.height).toBe(10);
      expect(result.dimensions.width).toBe(20);
      expect(result.dimensions.length).toBe(30);
    });

    it('should return null when productSchema is null', () => {
      const result = mapper.fromSchemaToEntity(null);

      expect(result).toBeNull();
    });

    it('should return null when productSchema is undefined', () => {
      const result = mapper.fromSchemaToEntity(undefined);

      expect(result).toBeNull();
    });
  });
});
