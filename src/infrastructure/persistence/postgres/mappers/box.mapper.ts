import { Injectable } from '@nestjs/common';
import { Box } from '@domain/entities/box.entity';
import { BoxTypeORM } from '../schemas/box.schema';
import { Dimensions } from '@domain/value-objects/dimensions.vo';

@Injectable()
export class BoxMapper {
  fromEntityToSchema(box: Box): BoxTypeORM {
    if (!box) return null;

    const boxSchema = new BoxTypeORM();
    boxSchema.boxId = box.boxId;
    boxSchema.boxType = box.boxType;
    boxSchema.height = box.dimensions.height;
    boxSchema.width = box.dimensions.width;
    boxSchema.length = box.dimensions.length;
    boxSchema.isActive = box.isActive;
    boxSchema.id = box.id;
    boxSchema.insertedAt = box.insertedAt;
    boxSchema.updatedAt = box.updatedAt;

    return boxSchema;
  }

  fromSchemaToEntity(boxSchema: BoxTypeORM): Box {
    if (!boxSchema) return null;

    const box = new Box(
      boxSchema.boxId,
      boxSchema.boxType as any, // We'll need to map this properly
      new Dimensions(
        Number(boxSchema.height),
        Number(boxSchema.width),
        Number(boxSchema.length),
      ),
      boxSchema.isActive,
    );

    // Set the inherited properties
    box.id = boxSchema.id;
    box.insertedAt = boxSchema.insertedAt;
    box.updatedAt = boxSchema.updatedAt;

    return box;
  }
}
