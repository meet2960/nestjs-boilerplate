import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import {
  Catch,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Response } from 'express';
import _ from 'lodash';
import type { IApiResponse } from '@/common/entity/IApiResponse';

@Catch(UnprocessableEntityException)
export class UnprocessableEntityExceptionFilter implements ExceptionFilter<UnprocessableEntityException> {
  constructor(public reflector: Reflector) {}

  catch(exception: UnprocessableEntityException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const statusCode = exception.getStatus();

    // TODO: Handle ZOD Validation Errors and pass the validation errors to the response
    // const r = exception.getResponse() as { message: ValidationError[] };
    // const validationErrors = r.message;
    // this.validationFilter(validationErrors);

    // ? Custom API Response
    const finalResponse: IApiResponse<null> = {
      data: null,
      message: 'Invalid Data in Request',
      error:
        'Data Validation Failed. Please check the request data and try again.',
      status: 'UNPROCESSABLE_ENTITY',
      statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    };
    response.status(statusCode).json(finalResponse);
  }

  // TODO: Handle ZOD Validation Errors and pass the validation errors to the response
  // private validationFilter(validationErrors: ValidationError[]): void {
  //   for (const validationError of validationErrors) {
  //     const children = validationError.children;

  //     if (children && !_.isEmpty(children)) {
  //       this.validationFilter(children);

  //       return;
  //     }

  //     delete validationError.children;

  //     const constraints = validationError.constraints;
  //     if (!constraints) {
  //       return;
  //     }

  //     for (const [constraintKey, constraint] of Object.entries(constraints)) {
  //       // convert default messages
  //       if (!constraint) {
  //         // convert error message to error.fields.{key} syntax for i18n translation
  //         constraints[constraintKey] = `error.fields.${_.snakeCase(
  //           constraintKey,
  //         )}`;
  //       }
  //     }
  //   }
  // }
}
