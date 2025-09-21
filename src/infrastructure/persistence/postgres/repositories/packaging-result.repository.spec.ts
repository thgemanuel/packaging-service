import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PackagingResultRepositoryTypeORM } from './packaging-result.repository';
import { PackagingResultTypeORM } from '../schemas/packaging-result.schema';
import { OrderTypeORM } from '../schemas/order.schema';
import { PackagingResultMapper } from '../mappers/packaging-result.mapper';
import { PackagingResult } from '@domain/entities/packaging-result.entity';
import { BoxType } from '@domain/enums/box-type.enum';
import { Box } from '@domain/entities/box.entity';
import { Product } from '@domain/entities/product.entity';
import { Dimensions } from '@domain/value-objects/dimensions.vo';

describe('PackagingResultRepositoryTypeORM', () => {
  let repository: PackagingResultRepositoryTypeORM;
  let typeOrmRepository: jest.Mocked<Repository<PackagingResultTypeORM>>;
  let orderRepository: jest.Mocked<Repository<OrderTypeORM>>;
  let mapper: jest.Mocked<PackagingResultMapper>;

  beforeEach(async () => {
    const mockTypeOrmRepository = {
      find: jest.fn(),
      save: jest.fn(),
      upsert: jest.fn(),
      findOne: jest.fn(),
    };

    const mockOrderRepository = {
      findOne: jest.fn(),
    };

    const mockMapper = {
      fromSchemaToEntity: jest.fn(),
      fromEntityToSchema: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PackagingResultRepositoryTypeORM,
        {
          provide: getRepositoryToken(PackagingResultTypeORM),
          useValue: mockTypeOrmRepository,
        },
        {
          provide: getRepositoryToken(OrderTypeORM),
          useValue: mockOrderRepository,
        },
        {
          provide: PackagingResultMapper,
          useValue: mockMapper,
        },
      ],
    }).compile();

    repository = module.get<PackagingResultRepositoryTypeORM>(
      PackagingResultRepositoryTypeORM,
    );
    typeOrmRepository = module.get(getRepositoryToken(PackagingResultTypeORM));
    orderRepository = module.get(getRepositoryToken(OrderTypeORM));
    mapper = module.get(PackagingResultMapper);
  });

  describe('findByOrderId', () => {
    it('should find packaging results by order ID', async () => {
      // Arrange
      const orderId = 'ORDER001';
      const mockSchema = {
        id: 'result-id',
        order: { orderId },
        boxType: 'Caixa 1',
        productsJson: ['PS5'],
        observation: null,
        insertedAt: new Date(),
        updatedAt: new Date(),
      } as unknown as PackagingResultTypeORM;

      const mockEntity = PackagingResult.createSuccessful(
        orderId,
        Box.createFromType(BoxType.CAIXA_1),
        [new Product('PS5', new Dimensions(40, 10, 25))],
      );

      typeOrmRepository.find.mockResolvedValue([mockSchema]);
      mapper.fromSchemaToEntity.mockReturnValue(mockEntity);

      // Act
      const result = await repository.findByOrderId(orderId);

      // Assert
      expect(typeOrmRepository.find).toHaveBeenCalledWith({
        where: { order: { orderId } },
        relations: ['order', 'box'],
        order: { insertedAt: 'DESC' },
      });
      expect(mapper.fromSchemaToEntity).toHaveBeenCalledWith(mockSchema);
      expect(result).toEqual([mockEntity]);
    });

    it('should return empty array when no results found', async () => {
      // Arrange
      const orderId = 'NONEXISTENT';
      typeOrmRepository.find.mockResolvedValue([]);

      // Act
      const result = await repository.findByOrderId(orderId);

      // Assert
      expect(result).toEqual([]);
      expect(mapper.fromSchemaToEntity).not.toHaveBeenCalled();
    });
  });

  describe('save', () => {
    it('should save packaging result successfully', async () => {
      // Arrange
      const orderId = 'ORDER001';
      const mockEntity = PackagingResult.createSuccessful(
        orderId,
        Box.createFromType(BoxType.CAIXA_1),
        [new Product('PS5', new Dimensions(40, 10, 25))],
      );
      const mockOrderSchema = { id: 'order-id', orderId } as OrderTypeORM;
      const mockResultSchema = {
        id: 'result-id',
        order: mockOrderSchema,
        boxType: 'Caixa 1',
        productsJson: ['PS5'],
        observation: null,
        insertedAt: new Date(),
        updatedAt: new Date(),
      } as unknown as PackagingResultTypeORM;

      orderRepository.findOne.mockResolvedValue(mockOrderSchema);
      mapper.fromEntityToSchema.mockReturnValue(mockResultSchema);
      typeOrmRepository.save.mockResolvedValue(mockResultSchema);
      mapper.fromSchemaToEntity.mockReturnValue(mockEntity);

      // Act
      const result = await repository.save(mockEntity);

      // Assert
      expect(orderRepository.findOne).toHaveBeenCalledWith({
        where: { orderId },
      });
      expect(mapper.fromEntityToSchema).toHaveBeenCalledWith(
        mockEntity,
        mockOrderSchema,
      );
      expect(typeOrmRepository.save).toHaveBeenCalledWith(mockResultSchema, {
        reload: true,
      });
      expect(result).toBe(mockEntity);
    });

    it('should throw error when order not found', async () => {
      // Arrange
      const orderId = 'NONEXISTENT';
      const mockEntity = PackagingResult.createSuccessful(
        orderId,
        Box.createFromType(BoxType.CAIXA_1),
        [new Product('PS5', new Dimensions(40, 10, 25))],
      );

      orderRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(repository.save(mockEntity)).rejects.toThrow(
        `Order with ID ${orderId} not found`,
      );
    });
  });

  describe('saveMany', () => {
    it('should save multiple packaging results successfully', async () => {
      // Arrange
      const orderId = 'ORDER001';
      const mockEntities = [
        PackagingResult.createSuccessful(
          orderId,
          Box.createFromType(BoxType.CAIXA_1),
          [new Product('PS5', new Dimensions(40, 10, 25))],
        ),
        PackagingResult.createSuccessful(
          orderId,
          Box.createFromType(BoxType.CAIXA_2),
          [new Product('XBOX', new Dimensions(30, 20, 15))],
        ),
      ];
      const mockOrderSchema = { id: 'order-id', orderId } as OrderTypeORM;
      const mockResultSchemas = [
        {
          id: 'result-1',
          order: mockOrderSchema,
          boxType: 'Caixa 1',
          productsJson: ['PS5'],
          observation: null,
          insertedAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'result-2',
          order: mockOrderSchema,
          boxType: 'Caixa 2',
          productsJson: ['XBOX'],
          observation: null,
          insertedAt: new Date(),
          updatedAt: new Date(),
        },
      ] as unknown as PackagingResultTypeORM[];

      orderRepository.findOne.mockResolvedValue(mockOrderSchema);
      mapper.fromEntityToSchema
        .mockReturnValueOnce(mockResultSchemas[0])
        .mockReturnValueOnce(mockResultSchemas[1]);
      typeOrmRepository.save.mockResolvedValue(mockResultSchemas as any);
      mapper.fromSchemaToEntity
        .mockReturnValueOnce(mockEntities[0])
        .mockReturnValueOnce(mockEntities[1]);

      // Act
      const result = await repository.saveMany(mockEntities);

      // Assert
      expect(orderRepository.findOne).toHaveBeenCalledTimes(2);
      expect(mapper.fromEntityToSchema).toHaveBeenCalledTimes(2);
      expect(typeOrmRepository.save).toHaveBeenCalledWith(mockResultSchemas, {
        reload: true,
      });
      expect(result).toEqual(mockEntities);
    });

    it('should throw error when any order not found', async () => {
      // Arrange
      const orderId = 'NONEXISTENT';
      const mockEntities = [
        PackagingResult.createSuccessful(
          orderId,
          Box.createFromType(BoxType.CAIXA_1),
          [new Product('PS5', new Dimensions(40, 10, 25))],
        ),
      ];

      orderRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(repository.saveMany(mockEntities)).rejects.toThrow(
        `Order with ID ${orderId} not found`,
      );
    });
  });

  describe('upsert', () => {
    it('should upsert packaging result successfully', async () => {
      // Arrange
      const orderId = 'ORDER001';
      const mockEntity = PackagingResult.createSuccessful(
        orderId,
        Box.createFromType(BoxType.CAIXA_1),
        [new Product('PS5', new Dimensions(40, 10, 25))],
      );
      const mockOrderSchema = { id: 'order-id', orderId } as OrderTypeORM;
      const mockResultSchema = {
        id: 'result-id',
        order: mockOrderSchema,
        boxType: 'Caixa 1',
        productsJson: ['PS5'],
        observation: null,
        insertedAt: new Date(),
        updatedAt: new Date(),
      } as unknown as PackagingResultTypeORM;

      const mockUpsertResult = {
        identifiers: [{ id: 'result-id' }],
      };

      orderRepository.findOne.mockResolvedValue(mockOrderSchema);
      mapper.fromEntityToSchema.mockReturnValue(mockResultSchema);
      typeOrmRepository.upsert.mockResolvedValue(mockUpsertResult as any);
      typeOrmRepository.findOne.mockResolvedValue(mockResultSchema);
      mapper.fromSchemaToEntity.mockReturnValue(mockEntity);

      // Act
      const result = await repository.upsert(mockEntity);

      // Assert
      expect(orderRepository.findOne).toHaveBeenCalledWith({
        where: { orderId },
      });
      expect(mapper.fromEntityToSchema).toHaveBeenCalledWith(
        mockEntity,
        mockOrderSchema,
      );
      expect(typeOrmRepository.upsert).toHaveBeenCalledWith(mockResultSchema, {
        conflictPaths: ['id'],
        skipUpdateIfNoValuesChanged: true,
      });
      expect(result).toBe(mockEntity);
    });

    it('should return original entity when upsert has no identifiers', async () => {
      // Arrange
      const orderId = 'ORDER001';
      const mockEntity = PackagingResult.createSuccessful(
        orderId,
        Box.createFromType(BoxType.CAIXA_1),
        [new Product('PS5', new Dimensions(40, 10, 25))],
      );
      const mockOrderSchema = { id: 'order-id', orderId } as OrderTypeORM;
      const mockResultSchema = {
        id: 'result-id',
        order: mockOrderSchema,
        boxType: 'Caixa 1',
        productsJson: ['PS5'],
        observation: null,
        insertedAt: new Date(),
        updatedAt: new Date(),
      } as unknown as PackagingResultTypeORM;

      const mockUpsertResult = {
        identifiers: [],
      };

      orderRepository.findOne.mockResolvedValue(mockOrderSchema);
      mapper.fromEntityToSchema.mockReturnValue(mockResultSchema);
      typeOrmRepository.upsert.mockResolvedValue(mockUpsertResult as any);

      // Act
      const result = await repository.upsert(mockEntity);

      // Assert
      expect(result).toBe(mockEntity);
    });
  });

  describe('upsertMany', () => {
    it('should upsert multiple packaging results successfully', async () => {
      // Arrange
      const orderId = 'ORDER001';
      const mockEntities = [
        PackagingResult.createSuccessful(
          orderId,
          Box.createFromType(BoxType.CAIXA_1),
          [new Product('PS5', new Dimensions(40, 10, 25))],
        ),
        PackagingResult.createSuccessful(
          orderId,
          Box.createFromType(BoxType.CAIXA_2),
          [new Product('XBOX', new Dimensions(30, 20, 15))],
        ),
      ];
      const mockOrderSchema = { id: 'order-id', orderId } as OrderTypeORM;
      const mockResultSchemas = [
        {
          id: 'result-1',
          order: mockOrderSchema,
          boxType: 'Caixa 1',
          productsJson: ['PS5'],
          observation: null,
          insertedAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'result-2',
          order: mockOrderSchema,
          boxType: 'Caixa 2',
          productsJson: ['XBOX'],
          observation: null,
          insertedAt: new Date(),
          updatedAt: new Date(),
        },
      ] as unknown as PackagingResultTypeORM[];

      const mockUpsertResult = {
        identifiers: [{ id: 'result-1' }, { id: 'result-2' }],
      };

      orderRepository.findOne.mockResolvedValue(mockOrderSchema);
      mapper.fromEntityToSchema
        .mockReturnValueOnce(mockResultSchemas[0])
        .mockReturnValueOnce(mockResultSchemas[1]);
      typeOrmRepository.upsert.mockResolvedValue(mockUpsertResult as any);
      typeOrmRepository.find.mockResolvedValue(mockResultSchemas);
      mapper.fromSchemaToEntity
        .mockReturnValueOnce(mockEntities[0])
        .mockReturnValueOnce(mockEntities[1]);

      // Act
      const result = await repository.upsertMany(mockEntities);

      // Assert
      expect(orderRepository.findOne).toHaveBeenCalledTimes(2);
      expect(mapper.fromEntityToSchema).toHaveBeenCalledTimes(2);
      expect(typeOrmRepository.upsert).toHaveBeenCalledWith(mockResultSchemas, {
        conflictPaths: ['id'],
        skipUpdateIfNoValuesChanged: true,
      });
      expect(typeOrmRepository.find).toHaveBeenCalledWith({
        where: { id: expect.any(Object) }, // Using expect.any(Object) for In(ids)
        relations: ['order', 'box'],
      });
      expect(result).toEqual(mockEntities);
    });

    it('should return original entities when upsert has no identifiers', async () => {
      // Arrange
      const orderId = 'ORDER001';
      const mockEntities = [
        PackagingResult.createSuccessful(
          orderId,
          Box.createFromType(BoxType.CAIXA_1),
          [new Product('PS5', new Dimensions(40, 10, 25))],
        ),
      ];
      const mockOrderSchema = { id: 'order-id', orderId } as OrderTypeORM;
      const mockResultSchema = {
        id: 'result-id',
        order: mockOrderSchema,
        boxType: 'Caixa 1',
        productsJson: ['PS5'],
        observation: null,
        insertedAt: new Date(),
        updatedAt: new Date(),
      } as unknown as PackagingResultTypeORM;

      const mockUpsertResult = {
        identifiers: [],
      };

      orderRepository.findOne.mockResolvedValue(mockOrderSchema);
      mapper.fromEntityToSchema.mockReturnValue(mockResultSchema);
      typeOrmRepository.upsert.mockResolvedValue(mockUpsertResult as any);

      // Act
      const result = await repository.upsertMany(mockEntities);

      // Assert
      expect(result).toBe(mockEntities);
    });
  });
});
