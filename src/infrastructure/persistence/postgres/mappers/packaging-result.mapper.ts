import { Injectable } from '@nestjs/common';
import { PackagingResult } from '@domain/entities/packaging-result.entity';
import { PackagingResultTypeORM } from '../schemas/packaging-result.schema';
import { BoxMapper } from './box.mapper';
import { ProductMapper } from './product.mapper';

@Injectable()
export class PackagingResultMapper {
  constructor(
    private readonly boxMapper: BoxMapper,
    private readonly productMapper: ProductMapper,
  ) {}

  fromEntityToSchema(
    result: PackagingResult,
    orderSchema?: any,
  ): PackagingResultTypeORM {
    if (!result) return null;

    const resultSchema = new PackagingResultTypeORM();
    resultSchema.id = result.id;
    resultSchema.boxType = result.box?.boxType || null;
    resultSchema.productsJson = result.products;
    resultSchema.observation = result.observation;
    resultSchema.insertedAt = result.insertedAt;
    resultSchema.updatedAt = result.updatedAt;

    // Set the order relation if provided
    if (orderSchema) {
      resultSchema.order = Promise.resolve(orderSchema);
    }

    return resultSchema;
  }

  fromSchemaToEntity(
    resultSchema: PackagingResultTypeORM,
    loadRelations = false,
  ): PackagingResult {
    if (!resultSchema) return null;

    // Note: This is a simplified version. In a real implementation,
    // you would load the box and products through their relationships
    const result = new PackagingResult(
      resultSchema.id,
      null, // box would be loaded separately
      resultSchema.productsJson || [],
      resultSchema.observation,
    );

    // Set the inherited properties
    result.id = resultSchema.id;
    result.insertedAt = resultSchema.insertedAt;
    result.updatedAt = resultSchema.updatedAt;

    return result;
  }
}
