import {
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { GeneralExceptionFilter } from './general-exception.filter';
import * as Sentry from '@sentry/nestjs';

jest.mock('@sentry/nestjs', () => ({
  captureException: jest.fn(),
}));

describe('GeneralExceptionFilter', () => {
  let filter: GeneralExceptionFilter;
  let logger: Logger;

  const mockJson = jest.fn();
  const mockStatus = jest.fn().mockReturnValue({ json: mockJson });
  const mockGetResponse = jest.fn().mockReturnValue({ status: mockStatus });
  const mockGetRequest = jest.fn().mockReturnValue({
    url: '/test-url',
    method: 'GET',
  });
  const mockHttpArgumentsHost = jest.fn().mockReturnValue({
    getResponse: mockGetResponse,
    getRequest: mockGetRequest,
  });
  const mockArgumentsHost: ArgumentsHost = {
    switchToHttp: mockHttpArgumentsHost,
    getArgByIndex: jest.fn(),
    getArgs: jest.fn(),
    getType: jest.fn(),
    switchToRpc: jest.fn(),
    switchToWs: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GeneralExceptionFilter,
        {
          provide: Logger,
          useValue: {
            warn: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    filter = module.get<GeneralExceptionFilter>(GeneralExceptionFilter);
    logger = module.get<Logger>(Logger);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  describe('catch', () => {
    it('should capture exception in Sentry and handle HTTP exception', () => {
      // Arrange
      const status = HttpStatus.BAD_REQUEST;
      const responseBody = { message: 'Bad Request' };
      const exception = new HttpException(responseBody, status);

      // Act
      filter.catch(exception, mockArgumentsHost);

      // Assert
      expect(Sentry.captureException).toHaveBeenCalledWith(exception);
      expect(logger.warn).toHaveBeenCalledWith('HTTP exception caught', {
        error: exception,
        status,
        response: responseBody,
        path: '/test-url',
        method: 'GET',
      });
      expect(mockStatus).toHaveBeenCalledWith(status);
      expect(mockJson).toHaveBeenCalledWith(responseBody);
    });

    it('should capture exception in Sentry and handle unexpected error', () => {
      // Arrange
      const exception = new Error('Unexpected error');
      const expectedResponse = {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: exception.message,
        error: exception.name,
        timestamp: expect.any(String),
        path: '/test-url',
      };

      // Act
      filter.catch(exception, mockArgumentsHost);

      // Assert
      expect(Sentry.captureException).toHaveBeenCalledWith(exception);
      expect(logger.error).toHaveBeenCalledWith('Unexpected error caught', {
        error: exception,
        path: '/test-url',
        method: 'GET',
      });
      expect(mockStatus).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockJson).toHaveBeenCalledWith(expectedResponse);
    });
  });
});
