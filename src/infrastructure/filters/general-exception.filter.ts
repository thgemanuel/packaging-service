import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
// import * as Sentry from '@sentry/nestjs'; // Removed Sentry integration

@Catch()
export class GeneralExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: Error | HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Sentry.captureException(exception); // Removed Sentry integration

    const isHttpException = exception instanceof HttpException;

    if (isHttpException) {
      const status = exception.getStatus();
      const responseBody = exception.getResponse();

      this.logger.warn('HTTP exception caught', {
        error: exception,
        status,
        response: responseBody,
        path: request.url,
        method: request.method,
      });

      response.status(status).json(responseBody);
      return;
    }

    const returnStatus = HttpStatus.INTERNAL_SERVER_ERROR;

    this.logger.error('Unexpected error caught', {
      error: exception,
      path: request.url,
      method: request.method,
    });

    const errorResponse = {
      statusCode: returnStatus,
      message: exception.message || null,
      error: exception.name || null,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(returnStatus).json(errorResponse);
  }
}
