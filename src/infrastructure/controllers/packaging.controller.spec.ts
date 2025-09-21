import { Test, TestingModule } from '@nestjs/testing';
import { PackagingController } from './packaging.controller';
import { PackageMultipleOrdersUseCase } from '@application/use-cases/package-multiple-orders.use-case';
import {
  PackagingRequestDto,
  PackagingResponseDto,
} from '@application/dto/packaging.dto';

describe('PackagingController', () => {
  let controller: PackagingController;
  let useCase: jest.Mocked<PackageMultipleOrdersUseCase>;

  beforeEach(async () => {
    const mockUseCase = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PackagingController],
      providers: [
        {
          provide: PackageMultipleOrdersUseCase,
          useValue: mockUseCase,
        },
      ],
    }).compile();

    controller = module.get<PackagingController>(PackagingController);
    useCase = module.get(PackageMultipleOrdersUseCase);
  });

  describe('processOrders', () => {
    it('should process orders successfully', async () => {
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

      const expectedResponse: PackagingResponseDto = {
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

      useCase.execute.mockResolvedValue(expectedResponse);

      // Act
      const result = await controller.processOrders(requestDto);

      // Assert
      expect(useCase.execute).toHaveBeenCalledWith(requestDto);
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

      const expectedResponse: PackagingResponseDto = {
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
          {
            pedido_id: 2,
            caixas: [
              {
                caixa_id: 'Caixa 2',
                produtos: ['XBOX'],
              },
            ],
          },
        ],
      };

      useCase.execute.mockResolvedValue(expectedResponse);

      // Act
      const result = await controller.processOrders(requestDto);

      // Assert
      expect(useCase.execute).toHaveBeenCalledWith(requestDto);
      expect(result).toEqual(expectedResponse);
    });

    it('should handle empty orders list', async () => {
      // Arrange
      const requestDto: PackagingRequestDto = {
        pedidos: [],
      };

      const expectedResponse: PackagingResponseDto = {
        pedidos: [],
      };

      useCase.execute.mockResolvedValue(expectedResponse);

      // Act
      const result = await controller.processOrders(requestDto);

      // Assert
      expect(useCase.execute).toHaveBeenCalledWith(requestDto);
      expect(result).toEqual(expectedResponse);
    });

    it('should handle orders with products that do not fit', async () => {
      // Arrange
      const requestDto: PackagingRequestDto = {
        pedidos: [
          {
            pedido_id: 1,
            produtos: [
              {
                produto_id: 'TOO_LARGE',
                dimensoes: {
                  altura: 100,
                  largura: 100,
                  comprimento: 100,
                },
              },
            ],
          },
        ],
      };

      const expectedResponse: PackagingResponseDto = {
        pedidos: [
          {
            pedido_id: 1,
            caixas: [
              {
                caixa_id: null,
                produtos: ['TOO_LARGE'],
                observacao: 'Produto não cabe em nenhuma caixa disponível.',
              },
            ],
          },
        ],
      };

      useCase.execute.mockResolvedValue(expectedResponse);

      // Act
      const result = await controller.processOrders(requestDto);

      // Assert
      expect(useCase.execute).toHaveBeenCalledWith(requestDto);
      expect(result).toEqual(expectedResponse);
    });

    it('should propagate use case errors', async () => {
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

      const error = new Error('Database connection failed');
      useCase.execute.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.processOrders(requestDto)).rejects.toThrow(
        'Database connection failed',
      );
      expect(useCase.execute).toHaveBeenCalledWith(requestDto);
    });

    it('should handle validation errors from use case', async () => {
      // Arrange
      const requestDto: PackagingRequestDto = {
        pedidos: [
          {
            pedido_id: 1,
            produtos: [
              {
                produto_id: 'INVALID',
                dimensoes: { altura: -1, largura: 10, comprimento: 25 },
              },
            ],
          },
        ],
      };

      const error = new Error('Invalid dimensions: height must be positive');
      useCase.execute.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.processOrders(requestDto)).rejects.toThrow(
        'Invalid dimensions: height must be positive',
      );
    });

    it('should handle orders with multiple products in single box', async () => {
      // Arrange
      const requestDto: PackagingRequestDto = {
        pedidos: [
          {
            pedido_id: 1,
            produtos: [
              {
                produto_id: 'PROD1',
                dimensoes: { altura: 10, largura: 10, comprimento: 10 },
              },
              {
                produto_id: 'PROD2',
                dimensoes: { altura: 15, largura: 15, comprimento: 15 },
              },
            ],
          },
        ],
      };

      const expectedResponse: PackagingResponseDto = {
        pedidos: [
          {
            pedido_id: 1,
            caixas: [
              {
                caixa_id: 'Caixa 1',
                produtos: ['PROD1', 'PROD2'],
              },
            ],
          },
        ],
      };

      useCase.execute.mockResolvedValue(expectedResponse);

      // Act
      const result = await controller.processOrders(requestDto);

      // Assert
      expect(useCase.execute).toHaveBeenCalledWith(requestDto);
      expect(result).toEqual(expectedResponse);
    });

    it('should handle orders with products split across multiple boxes', async () => {
      // Arrange
      const requestDto: PackagingRequestDto = {
        pedidos: [
          {
            pedido_id: 1,
            produtos: [
              {
                produto_id: 'LARGE1',
                dimensoes: { altura: 40, largura: 30, comprimento: 70 },
              },
              {
                produto_id: 'LARGE2',
                dimensoes: { altura: 45, largura: 45, comprimento: 35 },
              },
            ],
          },
        ],
      };

      const expectedResponse: PackagingResponseDto = {
        pedidos: [
          {
            pedido_id: 1,
            caixas: [
              {
                caixa_id: 'Caixa 1',
                produtos: ['LARGE1'],
              },
              {
                caixa_id: 'Caixa 2',
                produtos: ['LARGE2'],
              },
            ],
          },
        ],
      };

      useCase.execute.mockResolvedValue(expectedResponse);

      // Act
      const result = await controller.processOrders(requestDto);

      // Assert
      expect(useCase.execute).toHaveBeenCalledWith(requestDto);
      expect(result).toEqual(expectedResponse);
    });
  });
});
