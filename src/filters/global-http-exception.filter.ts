/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
import {
  type ExceptionFilter,
  type ArgumentsHost,
  Catch,
  HttpException,
  NotFoundException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Response } from 'express';
import { get } from 'lodash-es';
import { ZodValidationException } from 'nestjs-zod';
import { ZodError } from 'zod';
import type { IApiResponse } from '@/common/entity/IApiResponse';

@Catch(HttpException)
export class GlobalHttpExceptionFilter implements ExceptionFilter {
  constructor(public reflector: Reflector) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>();

    const exceptionMessage = exception.message;
    const statusCode = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const customResponse: IApiResponse<unknown> = {
      status: exceptionMessage.toUpperCase(),
      statusCode,
      message: get(exceptionResponse, 'message', 'Internal Server Error'),
      data: null,
    };

    if (exception instanceof NotFoundException) {
      customResponse.message = 'Resource Not Found';
      customResponse.status = 'NOT_FOUND';
      return response.status(statusCode).json(customResponse);
    } else {
      switch (statusCode) {
        case HttpStatus.BAD_REQUEST: {
          customResponse.message = get(
            exceptionResponse,
            'message',
            'Bad Request',
          );
          customResponse.status = 'BAD_REQUEST';
          customResponse.data = null;
          if (exception instanceof ZodValidationException) {
            const zodError = exception.getZodError();
            if (zodError instanceof ZodError) {
              const zodIssues = zodError.issues;
              console.log('List of Errors', { zodIssues });
              customResponse.error = zodIssues.map((issue) => ({
                message: issue.message,
                path: issue.path,
              }));
            }
          }

          break;
        }
        case HttpStatus.UNAUTHORIZED: {
          customResponse.message = get(
            exceptionResponse,
            'message',
            'Unauthorized',
          );
          customResponse.status = 'UNAUTHORIZED';
          break;
        }

        case HttpStatus.FORBIDDEN: {
          customResponse.message = get(
            exceptionResponse,
            'message',
            'Access Forbidden',
          );
          customResponse.status = 'FORBIDDEN';
          break;
        }

        case HttpStatus.PAYLOAD_TOO_LARGE: {
          customResponse.message = 'File is too large';
          customResponse.status = 'PAYLOAD_TOO_LARGE';
          break;
        }

        case HttpStatus.TOO_MANY_REQUESTS: {
          customResponse.message = 'Too Many Requests';
          customResponse.status = 'TOO MANY REQUESTS';
          break;
        }
        case HttpStatus.INTERNAL_SERVER_ERROR: {
          customResponse.status = 'INTERNAL_SERVER_ERROR';
          customResponse.message = 'Internal Server Error';
          break;
        }

        default: {
          if (exception instanceof HttpException) {
            if (typeof exceptionResponse === 'string') {
              customResponse.message = exceptionResponse;
            } else if (typeof exceptionResponse === 'object') {
              customResponse.message = 'Internal Server Error';
            }
          }
        }
      }
    }
    return response.status(statusCode).json(customResponse);
  }
}
