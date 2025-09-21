import { ApiProperty } from '@nestjs/swagger';

export class NotFoundDTO {
  /**
   * The HTTP status code of the error.
   * @example 404
   */
  @ApiProperty({ example: 404 })
  statusCode: number;

  /**
   * A human-readable message describing the error.
   * @example "Entity not found"
   */
  @ApiProperty({ example: 'Entity not found' })
  message: string;

  /**
   * The name of the error class or a string representing the error type.
   * @example "EntityNotFoundException"
   */
  @ApiProperty({ example: 'EntityNotFoundException' })
  error: string;
}
