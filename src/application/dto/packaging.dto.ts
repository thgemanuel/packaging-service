import { ApiProperty } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import { IsArray, IsDefined, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, ValidateNested } from 'class-validator';

export class DimensionsDto {
  @ApiProperty({ example: 40 })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsPositive()
  altura: number;

  @ApiProperty({ example: 10 })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsPositive()
  largura: number;

  @ApiProperty({ example: 25 })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsPositive()
  comprimento: number;
}

export class ProductDto {
  @ApiProperty({ example: 'PS5' })
  @IsString()
  @IsNotEmpty()
  produto_id: string;

  @ApiProperty({ type: DimensionsDto })
  @ValidateNested()
  @Type(() => DimensionsDto)
  dimensoes: DimensionsDto;
}

export class OrderDto {
  @ApiProperty({ example: 1 })
  @IsDefined()
  pedido_id: number;

  @ApiProperty({ type: [ProductDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductDto)
  produtos: ProductDto[];
}

export class PackagingRequestDto {
  @ApiProperty({ type: [OrderDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderDto)
  pedidos: OrderDto[];
}

export class PackagedBoxDto {
  @ApiProperty({ example: 'Caixa 2', nullable: true })
  @IsOptional()
  @IsString()
  caixa_id: string | null;

  @ApiProperty({ type: [String] })
  @IsArray()
  produtos: string[];

  @ApiProperty({ required: false, example: 'Produto não cabe em nenhuma caixa disponível.' })
  @IsOptional()
  @IsString()
  observacao?: string;
}

export class PackagedOrderDto {
  @ApiProperty({ example: 1 })
  pedido_id: number;

  @ApiProperty({ type: [PackagedBoxDto] })
  caixas: PackagedBoxDto[];
}

export class PackagingResponseDto {
  @ApiProperty({ type: [PackagedOrderDto] })
  pedidos: PackagedOrderDto[];
}
