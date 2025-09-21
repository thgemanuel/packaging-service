import { Injectable } from '@nestjs/common';
import { Order } from '@domain/entities/order.entity';
import { Product } from '@domain/entities/product.entity';
import { PackagingResult } from '@domain/entities/packaging-result.entity';
import {
  PackagingRequestDto,
  OrderDto,
  ProductDto,
  PackagedBoxDto,
  PackagedOrderDto,
} from '@application/dto/packaging.dto';

@Injectable()
export class PackagingMapper {
  mapOrderDtoToDomain(orderDto: OrderDto): Order {
    const products: Product[] = orderDto.produtos.map((p: ProductDto) => {
      return Product.create(
        p.produto_id,
        p.dimensoes.altura,
        p.dimensoes.largura,
        p.dimensoes.comprimento,
      );
    });
    return Order.createWithProducts(String(orderDto.pedido_id), products);
  }

  mapRequestToOrders(dto: PackagingRequestDto): Order[] {
    return dto.pedidos.map((order) => this.mapOrderDtoToDomain(order));
  }

  mapResultsToPackagedOrder(
    pedidoId: number,
    results: PackagingResult[],
  ): PackagedOrderDto {
    const caixas: PackagedBoxDto[] = results.map((res) => {
      const produtos = res.products.map((p) => p.productId);
      if (res.isUnpackable()) {
        return {
          caixa_id: null,
          produtos,
          observacao: 'Produto não cabe em nenhuma caixa disponível.',
        };
      }
      return {
        caixa_id: res.boxId,
        produtos,
      } as PackagedBoxDto;
    });

    return {
      pedido_id: pedidoId,
      caixas,
    };
  }
}
