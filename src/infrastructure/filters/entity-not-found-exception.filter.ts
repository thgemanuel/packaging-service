import { EntityNotFoundException } from '@domain/exceptions/entity-not-found.exception';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(EntityNotFoundException)
export class EntityNotFoundExceptionFilter
  implements ExceptionFilter<EntityNotFoundException>
{
  constructor(private readonly logger: Logger) {}

  catch(exception: EntityNotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();
    const status = HttpStatus.NOT_FOUND;
    const error = exception.name;

    this.logger.error('Entity not found exception', {
      error: exception,
      path: request.url,
      method: request.method,
    });

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      error,
    });
  }
}
