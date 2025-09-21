import { Test, TestingModule } from '@nestjs/testing';
import { BoxMapper } from './box.mapper';
import { BoxTypeORM } from '../schemas/box.schema';
import { Box } from '@domain/entities/box.entity';
import { BoxType } from '@domain/enums/box-type.enum';
import { Dimensions } from '@domain/value-objects/dimensions.vo';

describe('BoxMapper', () => {
  let mapper: BoxMapper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BoxMapper],
    }).compile();

    mapper = module.get<BoxMapper>(BoxMapper);
  });

  describe('fromEntityToSchema', () => {
    it('should convert Box entity to BoxTypeORM schema', () => {
      // Arrange
      const box = new Box(
        'BOX001',
        BoxType.CAIXA_1,
        new Dimensions(50, 50, 40),
        true,
      );
      box.id = 'box-id';
      box.insertedAt = new Date('2023-01-01');
      box.updatedAt = new Date('2023-01-02');

      // Act
      const result = mapper.fromEntityToSchema(box);

      // Assert
      expect(result).toBeInstanceOf(BoxTypeORM);
      expect(result.boxId).toBe('BOX001');
      expect(result.boxType).toBe(BoxType.CAIXA_1);
      expect(result.height).toBe(50);
      expect(result.width).toBe(50);
      expect(result.length).toBe(40);
      expect(result.isActive).toBe(true);
      expect(result.id).toBe('box-id');
      expect(result.insertedAt).toEqual(new Date('2023-01-01'));
      expect(result.updatedAt).toEqual(new Date('2023-01-02'));
    });

    it('should return null when box is null', () => {
      // Act
      const result = mapper.fromEntityToSchema(null);

      // Assert
      expect(result).toBeNull();
    });

    it('should return null when box is undefined', () => {
      // Act
      const result = mapper.fromEntityToSchema(undefined);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('fromSchemaToEntity', () => {
    it('should convert BoxTypeORM schema to Box entity', () => {
      // Arrange
      const boxSchema = new BoxTypeORM();
      boxSchema.id = 'box-id';
      boxSchema.boxId = 'BOX001';
      boxSchema.boxType = BoxType.CAIXA_1;
      boxSchema.height = 50;
      boxSchema.width = 50;
      boxSchema.length = 40;
      boxSchema.isActive = true;
      boxSchema.insertedAt = new Date('2023-01-01');
      boxSchema.updatedAt = new Date('2023-01-02');

      // Act
      const result = mapper.fromSchemaToEntity(boxSchema);

      // Assert
      expect(result).toBeInstanceOf(Box);
      expect(result.boxId).toBe('BOX001');
      expect(result.boxType).toBe(BoxType.CAIXA_1);
      expect(result.dimensions.height).toBe(50);
      expect(result.dimensions.width).toBe(50);
      expect(result.dimensions.length).toBe(40);
      expect(result.isActive).toBe(true);
      expect(result.id).toBe('box-id');
      expect(result.insertedAt).toEqual(new Date('2023-01-01'));
      expect(result.updatedAt).toEqual(new Date('2023-01-02'));
    });

    it('should handle string dimensions correctly', () => {
      // Arrange
      const boxSchema = new BoxTypeORM();
      boxSchema.id = 'box-id';
      boxSchema.boxId = 'BOX001';
      boxSchema.boxType = BoxType.CAIXA_1;
      boxSchema.height = '50' as any;
      boxSchema.width = '50' as any;
      boxSchema.length = '40' as any;
      boxSchema.isActive = true;
      boxSchema.insertedAt = new Date('2023-01-01');
      boxSchema.updatedAt = new Date('2023-01-02');

      // Act
      const result = mapper.fromSchemaToEntity(boxSchema);

      // Assert
      expect(result.dimensions.height).toBe(50);
      expect(result.dimensions.width).toBe(50);
      expect(result.dimensions.length).toBe(40);
    });

    it('should return null when boxSchema is null', () => {
      // Act
      const result = mapper.fromSchemaToEntity(null);

      // Assert
      expect(result).toBeNull();
    });

    it('should return null when boxSchema is undefined', () => {
      // Act
      const result = mapper.fromSchemaToEntity(undefined);

      // Assert
      expect(result).toBeNull();
    });
  });
});
