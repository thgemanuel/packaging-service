import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  PackagingRequestDto,
  PackagingResponseDto,
} from '@application/dto/packaging.dto';
import { PackageMultipleOrdersUseCase } from '@application/use-cases/package-multiple-orders.use-case';
import { BadRequestDTO } from '@infrastructure/dto/bad-request.dto';
import { InternalServerErrorDTO } from '@infrastructure/dto/internal-server-error.dto';
import { Dimensions } from '@domain/value-objects/dimensions.vo';

@Controller('packaging')
export class PackagingController {
  constructor(private readonly useCase: PackageMultipleOrdersUseCase) {}

  @Post('orders')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Processa pedidos e retorna caixas e produtos por caixa',
  })
  @ApiResponse({ status: HttpStatus.OK, type: PackagingResponseDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BadRequestDTO })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: InternalServerErrorDTO,
  })
  async processOrders(
    @Body() body: PackagingRequestDto,
  ): Promise<PackagingResponseDto> {
    return await this.useCase.execute(body);
  }
}
