import { Injectable } from '@nestjs/common';
import { Product } from '@domain/entities/product.entity';
import { ProductTypeORM } from '../schemas/product.schema';

@Injectable()
export class ProductMapper {
  fromEntityToSchema(product: Product): ProductTypeORM {
    if (!product) return null;

    const productSchema = new ProductTypeORM();
    productSchema.productId = product.productId;
    productSchema.height = product.dimensions.height;
    productSchema.width = product.dimensions.width;
    productSchema.length = product.dimensions.length;
    productSchema.id = product.id;
    productSchema.insertedAt = product.insertedAt;
    productSchema.updatedAt = product.updatedAt;

    return productSchema;
  }

  fromSchemaToEntity(productSchema: ProductTypeORM): Product {
    if (!productSchema) return null;

    const product = Product.create(
      productSchema.productId,
      Number(productSchema.height),
      Number(productSchema.width),
      Number(productSchema.length),
    );

    product.id = productSchema.id;
    product.insertedAt = productSchema.insertedAt;
    product.updatedAt = productSchema.updatedAt;

    return product;
  }
}
