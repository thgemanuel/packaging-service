import { resolveRecursivelyMessages } from '@domain/exceptions/domain.exception';
import { ValidationPipe, BadRequestException } from '@nestjs/common';

export function customExceptionFactoryValidationPipe() {
  return new ValidationPipe({
    transform: true,
    exceptionFactory: (errors) => {
      const errorsFormatted = errors.map((error) => {
        const errorList = [];

        resolveRecursivelyMessages(error, errorList);

        return {
          errors: errorList.join(', '),
          code: error.target.constructor.name,
        };
      });

      const errorResponse = {
        title: "Your request parameters didn't validate.",
        errors: errorsFormatted.map((error) => ({
          code: error.code,
          title: 'HTTP request validation error',
          reason: error.errors,
        })),
      };
      return new BadRequestException(errorResponse);
    },
  });
}
