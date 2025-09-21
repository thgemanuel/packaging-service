import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { PackagingResult } from '@domain/entities/packaging-result.entity';
import { PackagingResultRepository } from '@domain/repositories/packaging-result.repository';
import { PackagingResultTypeORM } from '../schemas/packaging-result.schema';
import { PackagingResultMapper } from '../mappers/packaging-result.mapper';
import { OrderTypeORM } from '../schemas/order.schema';

@Injectable()
export class PackagingResultRepositoryTypeORM
  implements PackagingResultRepository
{
  constructor(
    @InjectRepository(PackagingResultTypeORM)
    private readonly typeOrmRepository: Repository<PackagingResultTypeORM>,
    @InjectRepository(OrderTypeORM)
    private readonly orderRepository: Repository<OrderTypeORM>,
    private readonly packagingResultMapper: PackagingResultMapper,
  ) {}

  async findByOrderId(orderId: string): Promise<PackagingResult[]> {
    const resultSchemas = await this.typeOrmRepository.find({
      where: {
        order: { orderId },
      },
      relations: ['order', 'box'],
      order: { insertedAt: 'DESC' },
    });
    return resultSchemas.map((schema) =>
      this.packagingResultMapper.fromSchemaToEntity(schema),
    );
  }

  async save(result: PackagingResult): Promise<PackagingResult> {
    // Find the order by orderId to establish the relation
    const orderSchema = await this.orderRepository.findOne({
      where: { orderId: result.orderId },
    });

    if (!orderSchema) {
      throw new Error(`Order with ID ${result.orderId} not found`);
    }

    const resultSchema = this.packagingResultMapper.fromEntityToSchema(
      result,
      orderSchema,
    );
    const savedSchema = await this.typeOrmRepository.save(resultSchema, {
      reload: true,
    });
    return this.packagingResultMapper.fromSchemaToEntity(savedSchema);
  }

  async saveMany(results: PackagingResult[]): Promise<PackagingResult[]> {
    const resultSchemas: PackagingResultTypeORM[] = [];

    for (const result of results) {
      // Find the order by orderId to establish the relation
      const orderSchema = await this.orderRepository.findOne({
        where: { orderId: result.orderId },
      });

      if (!orderSchema) {
        throw new Error(`Order with ID ${result.orderId} not found`);
      }

      resultSchemas.push(
        this.packagingResultMapper.fromEntityToSchema(result, orderSchema),
      );
    }

    const savedSchemas = await this.typeOrmRepository.save(resultSchemas, {
      reload: true,
    });
    return savedSchemas.map((schema) =>
      this.packagingResultMapper.fromSchemaToEntity(schema),
    );
  }

  async upsert(result: PackagingResult): Promise<PackagingResult> {
    // Find the order by orderId to establish the relation
    const orderSchema = await this.orderRepository.findOne({
      where: { orderId: result.orderId },
    });

    if (!orderSchema) {
      throw new Error(`Order with ID ${result.orderId} not found`);
    }

    const resultSchema = this.packagingResultMapper.fromEntityToSchema(
      result,
      orderSchema,
    );

    // Use upsert to insert or update based on primary key
    const upsertResult = await this.typeOrmRepository.upsert(resultSchema, {
      conflictPaths: ['id'], // Assuming 'id' is the primary key
      skipUpdateIfNoValuesChanged: true,
    });

    // If upsert returns identifiers, fetch the full entity
    if (upsertResult.identifiers && upsertResult.identifiers.length > 0) {
      const savedSchema = await this.typeOrmRepository.findOne({
        where: { id: upsertResult.identifiers[0].id },
        relations: ['order', 'box'],
      });
      return savedSchema
        ? this.packagingResultMapper.fromSchemaToEntity(savedSchema)
        : result;
    }

    return result;
  }

  async upsertMany(results: PackagingResult[]): Promise<PackagingResult[]> {
    const resultSchemas: PackagingResultTypeORM[] = [];

    for (const result of results) {
      // Find the order by orderId to establish the relation
      const orderSchema = await this.orderRepository.findOne({
        where: { orderId: result.orderId },
      });

      if (!orderSchema) {
        throw new Error(`Order with ID ${result.orderId} not found`);
      }

      resultSchemas.push(
        this.packagingResultMapper.fromEntityToSchema(result, orderSchema),
      );
    }

    // Use upsert to insert or update based on primary key
    const upsertResult = await this.typeOrmRepository.upsert(resultSchemas, {
      conflictPaths: ['id'], // Assuming 'id' is the primary key
      skipUpdateIfNoValuesChanged: true,
    });

    // If upsert returns identifiers, fetch the full entities
    if (upsertResult.identifiers && upsertResult.identifiers.length > 0) {
      const ids = upsertResult.identifiers.map((identifier) => identifier.id);
      const savedSchemas = await this.typeOrmRepository.find({
        where: { id: In(ids) },
        relations: ['order', 'box'],
      });
      return savedSchemas.map((schema) =>
        this.packagingResultMapper.fromSchemaToEntity(schema),
      );
    }

    return results;
  }
}
