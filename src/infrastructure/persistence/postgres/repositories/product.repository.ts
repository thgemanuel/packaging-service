import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '@domain/entities/product.entity';
import { ProductRepository, PRODUCT_REPOSITORY_NAME } from '@domain/repositories/product.repository';
import { ProductTypeORM } from '../schemas/product.schema';
import { ProductMapper } from '../mappers/product.mapper';

@Injectable()
export class ProductRepositoryTypeORM implements ProductRepository {
  constructor(
    @InjectRepository(ProductTypeORM)
    private readonly typeOrmRepository: Repository<ProductTypeORM>,
    private readonly productMapper: ProductMapper,
  ) {}

  async findByProductId(productId: string): Promise<Product | null> {
    const productSchema = await this.typeOrmRepository.findOne({
      where: { productId },
    });
    return productSchema ? this.productMapper.fromSchemaToEntity(productSchema) : null;
  }

  async save(product: Product): Promise<Product> {
    const productSchema = this.productMapper.fromEntityToSchema(product);
    const savedSchema = await this.typeOrmRepository.save(productSchema, {
      reload: true,
    });
    return this.productMapper.fromSchemaToEntity(savedSchema);
  }

  async saveMany(products: Product[]): Promise<Product[]> {
    const productSchemas = products.map(product => this.productMapper.fromEntityToSchema(product));
    const savedSchemas = await this.typeOrmRepository.save(productSchemas, {
      reload: true,
    });
    return savedSchemas.map(schema => this.productMapper.fromSchemaToEntity(schema));
  }

  async upsert(product: Product): Promise<Product> {
    const productSchema = this.productMapper.fromEntityToSchema(product);
    
    // Try to find existing product by productId
    const existingProduct = await this.typeOrmRepository.findOne({
      where: { productId: product.productId },
    });

    if (existingProduct) {
      // Update existing product
      productSchema.id = existingProduct.id;
      productSchema.insertedAt = existingProduct.insertedAt;
    }

    const savedSchema = await this.typeOrmRepository.save(productSchema, {
      reload: true,
    });
    return this.productMapper.fromSchemaToEntity(savedSchema);
  }

  async upsertMany(products: Product[]): Promise<Product[]> {
    const savedProducts: Product[] = [];
    
    for (const product of products) {
      const savedProduct = await this.upsert(product);
      savedProducts.push(savedProduct);
    }
    
    return savedProducts;
  }
}
