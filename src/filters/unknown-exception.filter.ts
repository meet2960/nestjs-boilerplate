import {
  type ExceptionFilter,
  type ArgumentsHost,
  Catch,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Response } from 'express';
import { get } from 'lodash-es';
import type { IApiResponse } from '@/common/entity/IApiResponse';

@Catch()
export class UnknownExceptionFilter implements ExceptionFilter {
  constructor(public reflector: Reflector) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      return response
        .status(exception.getStatus())
        .json(exception.getResponse());
    }

    const exceptionMessage = get(
      exception,
      'message',
      'Internal Server Error occurred',
    );

    const customResponse: IApiResponse<unknown> = {
      status: 'INTERNAL_SERVER_ERROR',
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: exceptionMessage,
      data: null,
      error: exception,
    };

    return response.status(customResponse.statusCode).json(customResponse);
  }
}
