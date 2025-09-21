import { ApiProperty } from '@nestjs/swagger';

export class InternalServerErrorDTO {
  /**
   * The HTTP status code of the error.
   * @example 500
   */
  @ApiProperty({ example: 500 })
  statusCode: number;

  /**
   * A human-readable message describing the error.
   * @example "Internal Server Error"
   */
  @ApiProperty({ example: 'Internal Server Error' })
  message: string;

  /**
   * The name of the error class or a string representing the error type.
   * @example "TypeError"
   */
  @ApiProperty({ example: 'Error' })
  error: string;

  /**
   * A timestamp indicating when the error occurred in ISO 8601 format.
   * @example "2023-10-27T10:30:00.000Z"
   */
  @ApiProperty({ example: '2023-10-27T10:30:00.000Z' })
  timestamp: string;

  /**
   * The URL path that was being accessed when the error occurred.
   * @example "/api/proposals"
   */
  @ApiProperty({ example: '/api/proposals' })
  path: string;
}
