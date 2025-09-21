import { Injectable } from '@nestjs/common';
import { Order } from '@domain/entities/order.entity';
import { Product } from '@domain/entities/product.entity';
import { Box } from '@domain/entities/box.entity';
import { PackagingResult } from '@domain/entities/packaging-result.entity';

interface BoxAllocation {
  box: Box;
  products: Product[];
}

@Injectable()
export class PackagingAlgorithmService {
  private static readonly CAPACITY_UTILIZATION_LIMIT = 0.9;

  /**
   * Pack an order using First Fit Decreasing (by volume), with rotations and
   * a conservative capacity factor based on total volume.
   */
  packOrder(order: Order, availableBoxes: Box[]): PackagingResult[] {
    order.validateForProcessing();

    const products: Product[] = order.getProductsSortedByVolume();

    const notFittableProducts: Product[] = [];
    const fittableProducts: Product[] = [];

    for (const product of products) {
      const canFitInAny = availableBoxes.some((box) =>
        box.canFitProduct(product),
      );
      if (!canFitInAny) {
        notFittableProducts.push(product);
      } else {
        fittableProducts.push(product);
      }
    }

    const results: PackagingResult[] = [];
    if (notFittableProducts.length > 0) {
      results.push(
        PackagingResult.createFailed(
          order.orderId,
          notFittableProducts,
          'Produto não cabe em nenhuma caixa disponível.',
        ),
      );
    }

    if (fittableProducts.length === 0) {
      return results;
    }

    const allocations: BoxAllocation[] = [];

    for (const product of fittableProducts) {
      let placed = false;
      for (const allocation of allocations) {
        const newProducts = [...allocation.products, product];
        if (
          allocation.box.canFitProducts(newProducts) &&
          allocation.box.calculateSpaceUtilization(newProducts) <=
            PackagingAlgorithmService.CAPACITY_UTILIZATION_LIMIT
        ) {
          allocation.products.push(product);
          placed = true;
          break;
        }
      }

      if (placed) continue;

      const candidateBoxes = availableBoxes
        .filter((box) => box.canFitProduct(product))
        .sort((a, b) => a.getVolume() - b.getVolume());

      if (candidateBoxes.length === 0) {
        results.push(
          PackagingResult.createFailed(
            order.orderId,
            [product],
            'Produto não cabe em nenhuma caixa disponível.',
          ),
        );
        continue;
      }

      const selectedBox = candidateBoxes[0];
      allocations.push({ box: selectedBox, products: [product] });
    }

    for (const allocation of allocations) {
      const result = PackagingResult.createSuccessful(
        order.orderId,
        allocation.box,
        allocation.products,
      );
      results.push(result);
    }

    return results;
  }
}
