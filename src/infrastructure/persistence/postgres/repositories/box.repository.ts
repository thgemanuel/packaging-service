import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Box } from '@domain/entities/box.entity';
import { BoxRepository } from '@domain/repositories/box.repository';
import { BoxTypeORM } from '../schemas/box.schema';
import { BoxMapper } from '../mappers/box.mapper';
import { BoxType } from '@domain/enums/box-type.enum';

@Injectable()
export class BoxRepositoryTypeORM implements BoxRepository {
  constructor(
    @InjectRepository(BoxTypeORM)
    private readonly typeOrmRepository: Repository<BoxTypeORM>,
    private readonly boxMapper: BoxMapper,
  ) {}

  async findAll(): Promise<Box[]> {
    const boxSchemas = await this.typeOrmRepository.find({
      order: { boxId: 'ASC' },
    });
    return boxSchemas.map((schema) =>
      this.boxMapper.fromSchemaToEntity(schema),
    );
  }

  async findActive(): Promise<Box[]> {
    const boxSchemas = await this.typeOrmRepository.find({
      where: { isActive: true },
      order: { boxId: 'ASC' },
    });
    return boxSchemas.map((schema) =>
      this.boxMapper.fromSchemaToEntity(schema),
    );
  }

  async findByBoxId(boxId: string): Promise<Box | null> {
    const boxSchema = await this.typeOrmRepository.findOne({
      where: { boxId },
    });
    return boxSchema ? this.boxMapper.fromSchemaToEntity(boxSchema) : null;
  }

  async findByBoxType(boxType: BoxType): Promise<Box | null> {
    const boxSchema = await this.typeOrmRepository.findOne({
      where: { boxType: boxType as string },
    });
    return boxSchema ? this.boxMapper.fromSchemaToEntity(boxSchema) : null;
  }
}
