import { DomainException } from '@domain/exceptions/domain.exception';
import { ArgumentsHost, Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DomainExceptionFilter } from './domain-exception.filter';

describe('DomainExceptionFilter', () => {
  let filter: DomainExceptionFilter;
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
        DomainExceptionFilter,
        {
          provide: Logger,
          useValue: {
            warn: jest.fn(),
          },
        },
      ],
    }).compile();

    filter = module.get<DomainExceptionFilter>(DomainExceptionFilter);
    logger = module.get<Logger>(Logger);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  describe('catch', () => {
    it('should log warning and return 400 response with validation errors', () => {
      // Arrange
      const errors = ['Validation error 1', 'Validation error 2'];
      const exception = new DomainException(errors);
      const expectedResponse = {
        title: "Your request parameters didn't validate.",
        errors: errors.map((error) => ({
          code: exception.name,
          title: 'Domain validation error',
          reason: error,
        })),
      };

      // Act
      filter.catch(exception, mockArgumentsHost);

      // Assert
      expect(logger.warn).toHaveBeenCalledWith('Domain validation exception', {
        error: exception,
        errors: errors,
        path: '/test-url',
        method: 'GET',
      });
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith(expectedResponse);
    });
  });
});
