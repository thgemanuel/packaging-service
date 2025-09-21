import { Test, TestingModule } from '@nestjs/testing';
import { PackageMultipleOrdersUseCase } from './package-multiple-orders.use-case';
import { PackagingAlgorithmService } from '../services/packaging-algorithm.service';
import { PackagingMapper } from '../mappers/packaging.mapper';
import { OrderRepository } from '@domain/repositories/order.repository';
import { ProductRepository } from '@domain/repositories/product.repository';
import { PackagingResultRepository } from '@domain/repositories/packaging-result.repository';
import { BoxRepository } from '@domain/repositories/box.repository';
import {
  ORDER_REPOSITORY_NAME,
  PRODUCT_REPOSITORY_NAME,
  PACKAGING_RESULT_REPOSITORY_NAME,
  BOX_REPOSITORY_NAME,
} from '@domain/repositories';
import { PackagingRequestDto } from '../dto/packaging.dto';
import { Order } from '@domain/entities/order.entity';
import { Product } from '@domain/entities/product.entity';
import { Box } from '@domain/entities/box.entity';
import { PackagingResult } from '@domain/entities/packaging-result.entity';
import { BoxType } from '@domain/enums/box-type.enum';
import { Dimensions } from '@domain/value-objects/dimensions.vo';

describe('PackageMultipleOrdersUseCase', () => {
  let useCase: PackageMultipleOrdersUseCase;
  let algorithmService: jest.Mocked<PackagingAlgorithmService>;
  let mapper: jest.Mocked<PackagingMapper>;
  let orderRepository: jest.Mocked<OrderRepository>;
  let productRepository: jest.Mocked<ProductRepository>;
  let packagingResultRepository: jest.Mocked<PackagingResultRepository>;
  let boxRepository: jest.Mocked<BoxRepository>;

  beforeEach(async () => {
    const mockAlgorithmService = {
      packOrder: jest.fn(),
    };

    const mockMapper = {
      mapOrderDtoToDomain: jest.fn(),
      mapResultsToPackagedOrder: jest.fn(),
    };

    const mockOrderRepository = {
      upsert: jest.fn(),
    };

    const mockProductRepository = {
      upsertMany: jest.fn(),
    };

    const mockPackagingResultRepository = {
      upsertMany: jest.fn(),
    };

    const mockBoxRepository = {
      findActive: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PackageMultipleOrdersUseCase,
        {
          provide: PackagingAlgorithmService,
          useValue: mockAlgorithmService,
        },
        {
          provide: PackagingMapper,
          useValue: mockMapper,
        },
        {
          provide: ORDER_REPOSITORY_NAME,
          useValue: mockOrderRepository,
        },
        {
          provide: PRODUCT_REPOSITORY_NAME,
          useValue: mockProductRepository,
        },
        {
          provide: PACKAGING_RESULT_REPOSITORY_NAME,
          useValue: mockPackagingResultRepository,
        },
        {
          provide: BOX_REPOSITORY_NAME,
          useValue: mockBoxRepository,
        },
      ],
    }).compile();

    useCase = module.get<PackageMultipleOrdersUseCase>(
      PackageMultipleOrdersUseCase,
    );
    algorithmService = module.get(PackagingAlgorithmService);
    mapper = module.get(PackagingMapper);
    orderRepository = module.get(ORDER_REPOSITORY_NAME);
    productRepository = module.get(PRODUCT_REPOSITORY_NAME);
    packagingResultRepository = module.get(PACKAGING_RESULT_REPOSITORY_NAME);
    boxRepository = module.get(BOX_REPOSITORY_NAME);
  });

  describe('execute', () => {
    it('should process single order successfully', async () => {
      // Arrange
      const requestDto: PackagingRequestDto = {
        pedidos: [
          {
            pedido_id: 1,
            produtos: [
              {
                produto_id: 'PS5',
                dimensoes: {
                  altura: 40,
                  largura: 10,
                  comprimento: 25,
                },
              },
            ],
          },
        ],
      };

      const mockOrder = new Order('1', [
        new Product('PS5', new Dimensions(40, 10, 25)),
      ]);

      const mockBoxes = [
        Box.createFromType(BoxType.CAIXA_1),
        Box.createFromType(BoxType.CAIXA_2),
        Box.createFromType(BoxType.CAIXA_3),
      ];

      const mockResults = [
        PackagingResult.createSuccessful(
          '1',
          Box.createFromType(BoxType.CAIXA_1),
          [new Product('PS5', new Dimensions(40, 10, 25))],
        ),
      ];

      const expectedResponse = {
        pedidos: [
          {
            pedido_id: 1,
            caixas: [
              {
                caixa_id: 'Caixa 1',
                produtos: ['PS5'],
              },
            ],
          },
        ],
      };

      // Setup mocks
      boxRepository.findActive.mockResolvedValue(mockBoxes);
      mapper.mapOrderDtoToDomain.mockReturnValue(mockOrder);
      productRepository.upsertMany.mockResolvedValue(mockOrder.products);
      orderRepository.upsert.mockResolvedValue(mockOrder);
      algorithmService.packOrder.mockReturnValue(mockResults);
      packagingResultRepository.upsertMany.mockResolvedValue(mockResults);
      mapper.mapResultsToPackagedOrder.mockReturnValue(
        expectedResponse.pedidos[0],
      );

      // Act
      const result = await useCase.execute(requestDto);

      // Assert
      expect(boxRepository.findActive).toHaveBeenCalledTimes(1);
      expect(mapper.mapOrderDtoToDomain).toHaveBeenCalledWith(
        requestDto.pedidos[0],
      );
      expect(productRepository.upsertMany).toHaveBeenCalledWith(
        mockOrder.products,
      );
      expect(orderRepository.upsert).toHaveBeenCalledWith(mockOrder);
      expect(algorithmService.packOrder).toHaveBeenCalledWith(
        mockOrder,
        mockBoxes,
      );
      expect(packagingResultRepository.upsertMany).toHaveBeenCalledWith(
        mockResults,
      );
      expect(mapper.mapResultsToPackagedOrder).toHaveBeenCalledWith(
        1,
        mockResults,
      );
      expect(result).toEqual(expectedResponse);
    });

    it('should process multiple orders successfully', async () => {
      // Arrange
      const requestDto: PackagingRequestDto = {
        pedidos: [
          {
            pedido_id: 1,
            produtos: [
              {
                produto_id: 'PS5',
                dimensoes: { altura: 40, largura: 10, comprimento: 25 },
              },
            ],
          },
          {
            pedido_id: 2,
            produtos: [
              {
                produto_id: 'XBOX',
                dimensoes: { altura: 30, largura: 20, comprimento: 15 },
              },
            ],
          },
        ],
      };

      const mockBoxes = [Box.createFromType(BoxType.CAIXA_1)];
      const mockOrder1 = new Order('1', [
        new Product('PS5', new Dimensions(40, 10, 25)),
      ]);
      const mockOrder2 = new Order('2', [
        new Product('XBOX', new Dimensions(30, 20, 15)),
      ]);
      const mockResults1 = [
        PackagingResult.createSuccessful(
          '1',
          Box.createFromType(BoxType.CAIXA_1),
          [new Product('PS5', new Dimensions(40, 10, 25))],
        ),
      ];
      const mockResults2 = [
        PackagingResult.createSuccessful(
          '2',
          Box.createFromType(BoxType.CAIXA_1),
          [new Product('XBOX', new Dimensions(30, 20, 15))],
        ),
      ];

      // Setup mocks
      boxRepository.findActive.mockResolvedValue(mockBoxes);
      mapper.mapOrderDtoToDomain
        .mockReturnValueOnce(mockOrder1)
        .mockReturnValueOnce(mockOrder2);
      productRepository.upsertMany.mockResolvedValue([]);
      orderRepository.upsert
        .mockResolvedValueOnce(mockOrder1)
        .mockResolvedValueOnce(mockOrder2);
      algorithmService.packOrder
        .mockReturnValueOnce(mockResults1)
        .mockReturnValueOnce(mockResults2);
      packagingResultRepository.upsertMany.mockResolvedValue([]);
      mapper.mapResultsToPackagedOrder
        .mockReturnValueOnce({
          pedido_id: 1,
          caixas: [{ caixa_id: 'Caixa 1', produtos: ['PS5'] }],
        })
        .mockReturnValueOnce({
          pedido_id: 2,
          caixas: [{ caixa_id: 'Caixa 1', produtos: ['XBOX'] }],
        });

      // Act
      const result = await useCase.execute(requestDto);

      // Assert
      expect(result.pedidos).toHaveLength(2);
      expect(mapper.mapOrderDtoToDomain).toHaveBeenCalledTimes(2);
      expect(productRepository.upsertMany).toHaveBeenCalledTimes(2);
      expect(orderRepository.upsert).toHaveBeenCalledTimes(2);
      expect(algorithmService.packOrder).toHaveBeenCalledTimes(2);
      expect(packagingResultRepository.upsertMany).toHaveBeenCalledTimes(2);
      expect(mapper.mapResultsToPackagedOrder).toHaveBeenCalledTimes(2);
    });

    it('should handle empty orders list', async () => {
      // Arrange
      const requestDto: PackagingRequestDto = {
        pedidos: [],
      };

      const mockBoxes = [Box.createFromType(BoxType.CAIXA_1)];
      boxRepository.findActive.mockResolvedValue(mockBoxes);

      // Act
      const result = await useCase.execute(requestDto);

      // Assert
      expect(result.pedidos).toHaveLength(0);
      expect(mapper.mapOrderDtoToDomain).not.toHaveBeenCalled();
      expect(productRepository.upsertMany).not.toHaveBeenCalled();
      expect(orderRepository.upsert).not.toHaveBeenCalled();
      expect(algorithmService.packOrder).not.toHaveBeenCalled();
      expect(packagingResultRepository.upsertMany).not.toHaveBeenCalled();
      expect(mapper.mapResultsToPackagedOrder).not.toHaveBeenCalled();
    });

    it('should propagate repository errors', async () => {
      // Arrange
      const requestDto: PackagingRequestDto = {
        pedidos: [
          {
            pedido_id: 1,
            produtos: [
              {
                produto_id: 'PS5',
                dimensoes: { altura: 40, largura: 10, comprimento: 25 },
              },
            ],
          },
        ],
      };

      const mockBoxes = [Box.createFromType(BoxType.CAIXA_1)];
      const mockOrder = new Order('1', [
        new Product('PS5', new Dimensions(40, 10, 25)),
      ]);
      const error = new Error('Database connection failed');

      // Setup mocks
      boxRepository.findActive.mockResolvedValue(mockBoxes);
      mapper.mapOrderDtoToDomain.mockReturnValue(mockOrder);
      productRepository.upsertMany.mockRejectedValue(error);

      // Act & Assert
      await expect(useCase.execute(requestDto)).rejects.toThrow(
        'Database connection failed',
      );
    });

    it('should propagate algorithm service errors', async () => {
      // Arrange
      const requestDto: PackagingRequestDto = {
        pedidos: [
          {
            pedido_id: 1,
            produtos: [
              {
                produto_id: 'PS5',
                dimensoes: { altura: 40, largura: 10, comprimento: 25 },
              },
            ],
          },
        ],
      };

      const mockBoxes = [Box.createFromType(BoxType.CAIXA_1)];
      const mockOrder = new Order('1', [
        new Product('PS5', new Dimensions(40, 10, 25)),
      ]);
      const error = new Error('Packaging algorithm failed');

      // Setup mocks
      boxRepository.findActive.mockResolvedValue(mockBoxes);
      mapper.mapOrderDtoToDomain.mockReturnValue(mockOrder);
      productRepository.upsertMany.mockResolvedValue(mockOrder.products);
      orderRepository.upsert.mockResolvedValue(mockOrder);
      algorithmService.packOrder.mockImplementation(() => {
        throw error;
      });

      // Act & Assert
      await expect(useCase.execute(requestDto)).rejects.toThrow(
        'Packaging algorithm failed',
      );
    });
  });
});
