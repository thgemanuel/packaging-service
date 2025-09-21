import { ApiProperty } from '@nestjs/swagger';

class BadRequestDetail {
  /**
   * A code representing the type of error.
   * @example "DomainException"
   */
  @ApiProperty({ type: String, example: 'DomainException' })
  code: string;
  /**
   * A human-readable title for the error.
   * @example "Domain validation error"
   */
  @ApiProperty({ type: String, example: 'Domain validation error' })
  title: string;
  /**
   * A detailed description of the error reason.
   * @example ""
   */
  @ApiProperty({
    type: String,
    example: 'O campo userId é obrigatório e deve ser uma UUID válida.',
  })
  reason: string;
}

/**
 * Represents a generic Bad Request response structure.
 */
export class BadRequestDTO {
  /**
   * The title of the error response.
   * @example "Your request parameters didn't validate."
   */
  @ApiProperty({
    type: String,
    example: "Your request parameters didn't validate.",
  })
  title: string;

  /**
   * An array of error details.
   */
  @ApiProperty({ isArray: true, type: BadRequestDetail })
  errors: BadRequestDetail[];
}
