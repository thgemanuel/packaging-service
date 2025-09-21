import { EntityNotFoundException } from '@domain/exceptions/entity-not-found.exception';
import { ArgumentsHost, HttpStatus, Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { EntityNotFoundExceptionFilter } from './entity-not-found-exception.filter';

describe('EntityNotFoundExceptionFilter', () => {
  let filter: EntityNotFoundExceptionFilter;
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
        EntityNotFoundExceptionFilter,
        {
          provide: Logger,
          useValue: {
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    filter = module.get<EntityNotFoundExceptionFilter>(
      EntityNotFoundExceptionFilter,
    );
    logger = module.get<Logger>(Logger);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  describe('catch', () => {
    it('should log error and return 404 response', () => {
      const exception = new EntityNotFoundException('Entity not found');
      const expectedResponse = {
        statusCode: HttpStatus.NOT_FOUND,
        message: exception.message,
        error: exception.name,
      };

      filter.catch(exception, mockArgumentsHost);

      expect(logger.error).toHaveBeenCalledWith('Entity not found exception', {
        error: exception,
        path: '/test-url',
        method: 'GET',
      });
      expect(mockStatus).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(mockJson).toHaveBeenCalledWith(expectedResponse);
    });
  });
});
