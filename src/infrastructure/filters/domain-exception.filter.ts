import { DomainException } from '@domain/exceptions/domain.exception';
import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { Response } from 'express';

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter<DomainException> {
  constructor(private readonly logger: Logger) {}

  catch(exception: DomainException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();
    const returnStatus = 400;

    this.logger.warn('Domain validation exception', {
      error: exception,
      errors: exception.getErrors(),
      path: request.url,
      method: request.method,
    });

    response.status(returnStatus).json({
      title: "Your request parameters didn't validate.",
      errors: exception.getErrors().map((error) => ({
        code: exception.name,
        title: 'Domain validation error',
        reason: error,
      })),
    });
  }
}
