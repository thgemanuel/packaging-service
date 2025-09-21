import { Test, TestingModule } from '@nestjs/testing';
import { PackagingMapper } from './packaging.mapper';
import { Order } from '@domain/entities/order.entity';
import { Product } from '@domain/entities/product.entity';
import { PackagingResult } from '@domain/entities/packaging-result.entity';
import { BoxType } from '@domain/enums/box-type.enum';
import { Box } from '@domain/entities/box.entity';
import { Dimensions } from '@domain/value-objects/dimensions.vo';
import { PackagingRequestDto, OrderDto } from '../dto/packaging.dto';

describe('PackagingMapper', () => {
  let mapper: PackagingMapper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PackagingMapper],
    }).compile();

    mapper = module.get<PackagingMapper>(PackagingMapper);
  });

  describe('mapOrderDtoToDomain', () => {
    it('should map order DTO to domain order', () => {
      const orderDto: OrderDto = {
        pedido_id: 123,
        produtos: [
          {
            produto_id: 'PS5',
            dimensoes: {
              altura: 40,
              largura: 10,
              comprimento: 25,
            },
          },
          {
            produto_id: 'XBOX',
            dimensoes: {
              altura: 30,
              largura: 20,
              comprimento: 15,
            },
          },
        ],
      };

      const result = mapper.mapOrderDtoToDomain(orderDto);

      expect(result).toBeInstanceOf(Order);
      expect(result.orderId).toBe('123');
      expect(result.productCount).toBe(2);

      const products = result.products;
      expect(products[0].productId).toBe('PS5');
      expect(products[0].height).toBe(40);
      expect(products[0].width).toBe(10);
      expect(products[0].length).toBe(25);

      expect(products[1].productId).toBe('XBOX');
      expect(products[1].height).toBe(30);
      expect(products[1].width).toBe(20);
      expect(products[1].length).toBe(15);
    });

    it('should handle empty products array', () => {
      const orderDto: OrderDto = {
        pedido_id: 456,
        produtos: [],
      };

      const result = mapper.mapOrderDtoToDomain(orderDto);

      expect(result).toBeInstanceOf(Order);
      expect(result.orderId).toBe('456');
      expect(result.productCount).toBe(0);
    });

    it('should convert pedido_id to string', () => {
      const orderDto: OrderDto = {
        pedido_id: 789,
        produtos: [],
      };

      const result = mapper.mapOrderDtoToDomain(orderDto);

      expect(result.orderId).toBe('789');
      expect(typeof result.orderId).toBe('string');
    });
  });

  describe('mapRequestToOrders', () => {
    it('should map request DTO to array of domain orders', () => {
      const requestDto: PackagingRequestDto = {
        pedidos: [
          {
            pedido_id: 1,
            produtos: [
              {
                produto_id: 'PROD1',
                dimensoes: { altura: 10, largura: 20, comprimento: 30 },
              },
            ],
          },
          {
            pedido_id: 2,
            produtos: [
              {
                produto_id: 'PROD2',
                dimensoes: { altura: 15, largura: 25, comprimento: 35 },
              },
            ],
          },
        ],
      };

      const result = mapper.mapRequestToOrders(requestDto);

      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(Order);
      expect(result[1]).toBeInstanceOf(Order);
      expect(result[0].orderId).toBe('1');
      expect(result[1].orderId).toBe('2');
    });

    it('should handle empty pedidos array', () => {
      const requestDto: PackagingRequestDto = {
        pedidos: [],
      };

      const result = mapper.mapRequestToOrders(requestDto);

      expect(result).toHaveLength(0);
    });
  });

  describe('mapResultsToPackagedOrder', () => {
    it('should map successful packaging results to packaged order DTO', () => {
      const products = [
        new Product('PS5', new Dimensions(40, 10, 25)),
        new Product('XBOX', new Dimensions(30, 20, 15)),
      ];

      const results = [
        PackagingResult.createSuccessful(
          '123',
          Box.createFromType(BoxType.CAIXA_1),
          products,
        ),
      ];

      const result = mapper.mapResultsToPackagedOrder(123, results);

      expect(result.pedido_id).toBe(123);
      expect(result.caixas).toHaveLength(1);
      expect(result.caixas[0].caixa_id).toBe('Caixa 1');
      expect(result.caixas[0].produtos).toEqual(['PS5', 'XBOX']);
      expect(result.caixas[0].observacao).toBeUndefined();
    });

    it('should map failed packaging results to packaged order DTO', () => {
      const products = [
        new Product('TOO_LARGE', new Dimensions(100, 100, 100)),
      ];

      const results = [
        PackagingResult.createFailed(
          '123',
          products,
          'Produto não cabe em nenhuma caixa disponível.',
        ),
      ];

      const result = mapper.mapResultsToPackagedOrder(123, results);

      expect(result.pedido_id).toBe(123);
      expect(result.caixas).toHaveLength(1);
      expect(result.caixas[0].caixa_id).toBeNull();
      expect(result.caixas[0].produtos).toEqual(['TOO_LARGE']);
      expect(result.caixas[0].observacao).toBe(
        'Produto não cabe em nenhuma caixa disponível.',
      );
    });

    it('should map mixed successful and failed results', () => {
      const successfulProducts = [
        new Product('PS5', new Dimensions(40, 10, 25)),
      ];
      const failedProducts = [
        new Product('TOO_LARGE', new Dimensions(100, 100, 100)),
      ];

      const results = [
        PackagingResult.createSuccessful(
          '123',
          Box.createFromType(BoxType.CAIXA_1),
          successfulProducts,
        ),
        PackagingResult.createFailed(
          '123',
          failedProducts,
          'Produto não cabe em nenhuma caixa disponível.',
        ),
      ];

      const result = mapper.mapResultsToPackagedOrder(123, results);

      expect(result.pedido_id).toBe(123);
      expect(result.caixas).toHaveLength(2);

      expect(result.caixas[0].caixa_id).toBe('Caixa 1');
      expect(result.caixas[0].produtos).toEqual(['PS5']);
      expect(result.caixas[0].observacao).toBeUndefined();

      expect(result.caixas[1].caixa_id).toBeNull();
      expect(result.caixas[1].produtos).toEqual(['TOO_LARGE']);
      expect(result.caixas[1].observacao).toBe(
        'Produto não cabe em nenhuma caixa disponível.',
      );
    });

    it('should handle empty results array', () => {
      const results: PackagingResult[] = [];

      const result = mapper.mapResultsToPackagedOrder(456, results);

      expect(result.pedido_id).toBe(456);
      expect(result.caixas).toHaveLength(0);
    });

    it('should handle multiple successful results', () => {
      const products1 = [new Product('PROD1', new Dimensions(10, 10, 10))];
      const products2 = [new Product('PROD2', new Dimensions(15, 15, 15))];

      const results = [
        PackagingResult.createSuccessful(
          '123',
          Box.createFromType(BoxType.CAIXA_1),
          products1,
        ),
        PackagingResult.createSuccessful(
          '123',
          Box.createFromType(BoxType.CAIXA_2),
          products2,
        ),
      ];

      const result = mapper.mapResultsToPackagedOrder(123, results);

      expect(result.pedido_id).toBe(123);
      expect(result.caixas).toHaveLength(2);
      expect(result.caixas[0].caixa_id).toBe('Caixa 1');
      expect(result.caixas[0].produtos).toEqual(['PROD1']);
      expect(result.caixas[1].caixa_id).toBe('Caixa 2');
      expect(result.caixas[1].produtos).toEqual(['PROD2']);
    });
  });

  describe('error handling', () => {
    it('should propagate errors from Product.create', () => {
      const orderDto: OrderDto = {
        pedido_id: 123,
        produtos: [
          {
            produto_id: 'INVALID',
            dimensoes: {
              altura: -1,
              largura: 10,
              comprimento: 25,
            },
          },
        ],
      };

      expect(() => mapper.mapOrderDtoToDomain(orderDto)).toThrow();
    });

    it('should propagate errors from Order.createWithProducts', () => {
      const orderDto: OrderDto = {
        pedido_id: 123,
        produtos: [
          {
            produto_id: 'PROD1',
            dimensoes: { altura: 10, largura: 20, comprimento: 30 },
          },
          {
            produto_id: 'PROD1',
            dimensoes: { altura: 15, largura: 25, comprimento: 35 },
          },
        ],
      };

      expect(() => mapper.mapOrderDtoToDomain(orderDto)).toThrow();
    });
  });
});
