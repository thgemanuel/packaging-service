import { Test, TestingModule } from '@nestjs/testing';
import { PackagingResultMapper } from './packaging-result.mapper';
import { PackagingResultTypeORM } from '../schemas/packaging-result.schema';
import {
  PackagingResult,
  PackagedProduct,
} from '@domain/entities/packaging-result.entity';
import { BoxMapper } from './box.mapper';
import { ProductMapper } from './product.mapper';
import { Box } from '@domain/entities/box.entity';
import { BoxType } from '@domain/enums/box-type.enum';
import { Dimensions } from '@domain/value-objects/dimensions.vo';

describe('PackagingResultMapper', () => {
  let mapper: PackagingResultMapper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PackagingResultMapper,
        {
          provide: BoxMapper,
          useValue: {
            fromSchemaToEntity: jest.fn(),
          },
        },
        {
          provide: ProductMapper,
          useValue: {
            fromSchemaToEntity: jest.fn(),
          },
        },
      ],
    }).compile();

    mapper = module.get<PackagingResultMapper>(PackagingResultMapper);
  });

  describe('fromEntityToSchema', () => {
    it('should convert PackagingResult entity to PackagingResultTypeORM schema', () => {
      const box = new Box(
        'BOX001',
        BoxType.CAIXA_1,
        new Dimensions(50, 50, 40),
      );
      const packagedProducts: PackagedProduct[] = [
        {
          productId: 'PROD001',
          originalDimensions: { height: 10, width: 20, length: 30 },
        },
        {
          productId: 'PROD002',
          originalDimensions: { height: 15, width: 25, length: 35 },
        },
      ];
      const result = new PackagingResult(
        'ORDER001',
        box,
        packagedProducts,
        'Test observation',
      );
      result.id = 'result-id';
      result.insertedAt = new Date('2023-01-01');
      result.updatedAt = new Date('2023-01-02');

      const orderSchema = { id: 'order-id', orderId: 'ORDER001' };

      const schemaResult = mapper.fromEntityToSchema(result, orderSchema);

      expect(schemaResult).toBeInstanceOf(PackagingResultTypeORM);
      expect(schemaResult.id).toBe('result-id');
      expect(schemaResult.boxType).toBe(BoxType.CAIXA_1);
      expect(schemaResult.productsJson).toEqual(packagedProducts);
      expect(schemaResult.observation).toBe('Test observation');
      expect(schemaResult.insertedAt).toEqual(new Date('2023-01-01'));
      expect(schemaResult.updatedAt).toEqual(new Date('2023-01-02'));
    });

    it('should convert PackagingResult entity to schema without order', () => {
      const box = new Box(
        'BOX001',
        BoxType.CAIXA_1,
        new Dimensions(50, 50, 40),
      );
      const packagedProducts: PackagedProduct[] = [
        {
          productId: 'PROD001',
          originalDimensions: { height: 10, width: 20, length: 30 },
        },
      ];
      const result = new PackagingResult(
        'ORDER001',
        box,
        packagedProducts,
        null,
      );
      result.id = 'result-id';
      result.insertedAt = new Date('2023-01-01');
      result.updatedAt = new Date('2023-01-02');

      const schemaResult = mapper.fromEntityToSchema(result);

      expect(schemaResult).toBeInstanceOf(PackagingResultTypeORM);
      expect(schemaResult.id).toBe('result-id');
      expect(schemaResult.boxType).toBe(BoxType.CAIXA_1);
      expect(schemaResult.productsJson).toEqual(packagedProducts);
      expect(schemaResult.observation).toBeNull();
      expect(schemaResult.insertedAt).toEqual(new Date('2023-01-01'));
      expect(schemaResult.updatedAt).toEqual(new Date('2023-01-02'));
    });

    it('should handle PackagingResult without box', () => {
      const packagedProducts: PackagedProduct[] = [
        {
          productId: 'PROD001',
          originalDimensions: { height: 10, width: 20, length: 30 },
        },
      ];
      const result = new PackagingResult(
        'ORDER001',
        null,
        packagedProducts,
        'No box available',
      );
      result.id = 'result-id';
      result.insertedAt = new Date('2023-01-01');
      result.updatedAt = new Date('2023-01-02');

      const schemaResult = mapper.fromEntityToSchema(result);

      expect(schemaResult).toBeInstanceOf(PackagingResultTypeORM);
      expect(schemaResult.id).toBe('result-id');
      expect(schemaResult.boxType).toBeNull();
      expect(schemaResult.productsJson).toEqual(packagedProducts);
      expect(schemaResult.observation).toBe('No box available');
    });

    it('should return null when result is null', () => {
      const result = mapper.fromEntityToSchema(null);

      expect(result).toBeNull();
    });

    it('should return null when result is undefined', () => {
      const result = mapper.fromEntityToSchema(undefined);

      expect(result).toBeNull();
    });
  });

  describe('fromSchemaToEntity', () => {
    it('should convert PackagingResultTypeORM schema to PackagingResult entity', () => {
      const packagedProducts: PackagedProduct[] = [
        {
          productId: 'PROD001',
          originalDimensions: { height: 10, width: 20, length: 30 },
        },
        {
          productId: 'PROD002',
          originalDimensions: { height: 15, width: 25, length: 35 },
        },
      ];
      const resultSchema = new PackagingResultTypeORM();
      resultSchema.id = 'result-id';
      resultSchema.boxType = BoxType.CAIXA_1;
      resultSchema.productsJson = packagedProducts;
      resultSchema.observation = 'Test observation';
      resultSchema.insertedAt = new Date('2023-01-01');
      resultSchema.updatedAt = new Date('2023-01-02');

      const result = mapper.fromSchemaToEntity(resultSchema);

      expect(result).toBeInstanceOf(PackagingResult);
      expect(result.id).toBe('result-id');
      expect(result.box).toBeNull();
      expect(result.products).toEqual(packagedProducts);
      expect(result.observation).toBe('Test observation');
      expect(result.insertedAt).toEqual(new Date('2023-01-01'));
      expect(result.updatedAt).toEqual(new Date('2023-01-02'));
    });

    it('should convert schema to entity with loadRelations flag', () => {
      const packagedProducts: PackagedProduct[] = [
        {
          productId: 'PROD001',
          originalDimensions: { height: 10, width: 20, length: 30 },
        },
      ];
      const resultSchema = new PackagingResultTypeORM();
      resultSchema.id = 'result-id';
      resultSchema.boxType = BoxType.CAIXA_1;
      resultSchema.productsJson = packagedProducts;
      resultSchema.observation = null;
      resultSchema.insertedAt = new Date('2023-01-01');
      resultSchema.updatedAt = new Date('2023-01-02');

      const result = mapper.fromSchemaToEntity(resultSchema);

      expect(result).toBeInstanceOf(PackagingResult);
      expect(result.id).toBe('result-id');
      expect(result.box).toBeNull();
      expect(result.products).toEqual(packagedProducts);
      expect(result.observation).toBeNull();
    });

    it('should handle null productsJson', () => {
      const resultSchema = new PackagingResultTypeORM();
      resultSchema.id = 'result-id';
      resultSchema.boxType = BoxType.CAIXA_1;
      resultSchema.productsJson = null;
      resultSchema.observation = 'No products';
      resultSchema.insertedAt = new Date('2023-01-01');
      resultSchema.updatedAt = new Date('2023-01-02');

      const result = mapper.fromSchemaToEntity(resultSchema);

      expect(result).toBeInstanceOf(PackagingResult);
      expect(result.products).toEqual([]);
      expect(result.observation).toBe('No products');
    });

    it('should return null when resultSchema is null', () => {
      const result = mapper.fromSchemaToEntity(null);

      expect(result).toBeNull();
    });

    it('should return null when resultSchema is undefined', () => {
      const result = mapper.fromSchemaToEntity(undefined);

      expect(result).toBeNull();
    });
  });
});
