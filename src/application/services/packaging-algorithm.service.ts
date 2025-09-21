import { Injectable } from '@nestjs/common';
import { Order } from '@domain/entities/order.entity';
import { Product } from '@domain/entities/product.entity';
import { Box } from '@domain/entities/box.entity';
import { PackagingResult } from '@domain/entities/packaging-result.entity';
import { ProductDoesNotFitException } from '@domain/exceptions/product-does-not-fit.exception';

interface BoxAllocation {
  box: Box;
  products: Product[];
}

@Injectable()
export class PackagingAlgorithmService {
  // Capacity factor to avoid over-optimistic packing by volume only
  private static readonly CAPACITY_UTILIZATION_LIMIT = 0.9;

  /**
   * Pack an order using First Fit Decreasing (by volume), with rotations and
   * a conservative capacity factor based on total volume.
   */
  packOrder(order: Order, availableBoxes: Box[]): PackagingResult[] {
    order.validateForProcessing();

    // Sort products by volume descending (largest first)
    const products: Product[] = order.getProductsSortedByVolume();

    // Validate each product fits at least in one box individually
    const notFittableProducts: Product[] = [];
    const fittableProducts: Product[] = [];

    for (const product of products) {
      const canFitInAny = availableBoxes.some((box) => box.canFitProduct(product));
      if (!canFitInAny) {
        notFittableProducts.push(product);
      } else {
        fittableProducts.push(product);
      }
    }

    // If there are products that cannot fit in any box, produce a failure result for them
    const results: PackagingResult[] = [];
    if (notFittableProducts.length > 0) {
      results.push(
        PackagingResult.createFailed(
          order.orderId,
          notFittableProducts,
          'Produto não cabe em nenhuma caixa disponível.'
        )
      );
    }

    if (fittableProducts.length === 0) {
      return results;
    }

    // Prepare box allocations (open boxes)
    const allocations: BoxAllocation[] = [];

    for (const product of fittableProducts) {
      // Try to place into first allocation where it fits and stays under utilization threshold
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

      // Open a new box: choose the smallest available box that can fit this product
      const candidateBoxes = availableBoxes
        .filter((box) => box.canFitProduct(product))
        .sort((a, b) => a.getVolume() - b.getVolume());

      if (candidateBoxes.length === 0) {
        // Should not happen because we filtered fittableProducts before, but guard anyway
        results.push(
          PackagingResult.createFailed(order.orderId, [product], 'Produto não cabe em nenhuma caixa disponível.')
        );
        continue;
      }

      const selectedBox = candidateBoxes[0];
      allocations.push({ box: selectedBox, products: [product] });
    }

    // Build successful packaging results from allocations
    for (const allocation of allocations) {
      const result = PackagingResult.createSuccessful(
        order.orderId,
        allocation.box,
        allocation.products
      );
      results.push(result);
    }

    return results;
  }
}
