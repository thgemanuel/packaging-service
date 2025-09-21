import { Injectable, Inject } from '@nestjs/common';
import { PackagingAlgorithmService } from '../services/packaging-algorithm.service';
import {
  PackagingRequestDto,
  PackagingResponseDto,
  PackagedOrderDto,
} from '../dto/packaging.dto';
import { Order } from '@domain/entities/order.entity';
import { Box } from '@domain/entities/box.entity';
import { BoxType, BoxTypeHelper } from '@domain/enums/box-type.enum';
import { PackagingMapper } from '@application/mappers/packaging.mapper';
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

@Injectable()
export class PackageMultipleOrdersUseCase {
  constructor(
    private readonly algorithm: PackagingAlgorithmService,
    private readonly mapper: PackagingMapper,
    @Inject(ORDER_REPOSITORY_NAME)
    private readonly orderRepository: OrderRepository,
    @Inject(PRODUCT_REPOSITORY_NAME)
    private readonly productRepository: ProductRepository,
    @Inject(PACKAGING_RESULT_REPOSITORY_NAME)
    private readonly packagingResultRepository: PackagingResultRepository,
    @Inject(BOX_REPOSITORY_NAME)
    private readonly boxRepository: BoxRepository,
  ) {}

  async execute(dto: PackagingRequestDto): Promise<PackagingResponseDto> {
    // Get available boxes (lazy initialization)
    const availableBoxes: Box[] = await this.boxRepository.findActive();

    const response: PackagingResponseDto = { pedidos: [] };

    for (const orderDto of dto.pedidos) {
      // 1. Criar e persistir o pedido com produtos
      const order: Order = this.mapper.mapOrderDtoToDomain(orderDto);

      // 2. Upsert produtos (criar ou atualizar)
      await this.productRepository.upsertMany(order.products);

      // 3. Upsert o pedido (criar ou atualizar)
      const savedOrder = await this.orderRepository.upsert(order);

      // 4. Executar algoritmo de empacotamento
      const results = this.algorithm.packOrder(order, availableBoxes);

      // 5. Upsert resultados de empacotamento (deletar existentes e criar novos)
      await this.packagingResultRepository.upsertMany(results);

      // 6. Mapear para DTO de resposta
      const packagedOrder: PackagedOrderDto =
        this.mapper.mapResultsToPackagedOrder(orderDto.pedido_id, results);
      response.pedidos.push(packagedOrder);
    }

    return response;
  }
}
