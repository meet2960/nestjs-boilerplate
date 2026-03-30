import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { WinstonLoggerService } from '../winston-logger/winston-logger.service';
import type { API_MODULE_NAMES } from '@/config/global/global-config-types';
import { type IApiResponse } from '@/common/entity/IApiResponse';
import { getRandomUUID } from '@/common/utility/generator-utils';

type OmittedResponse<T> = Omit<IApiResponse<T>, 'status' | 'statusCode'>;

@Injectable()
export class ResponseTypeService {
  private readonly localLogger = new Logger();
  constructor(private readonly winstonService: WinstonLoggerService) {}

  private readonly getHttpStatusValues = Object.fromEntries(
    Object.entries(HttpStatus).map(([key, value]) => [
      value as HttpStatus,
      key,
    ]),
  ) as Record<number, string>;

  createResponse<T>(obj: IApiResponse<T>): IApiResponse<T> {
    const response: IApiResponse<T> = {
      status: this.getHttpStatusValues[obj.statusCode]!,
      statusCode: obj.statusCode,
      message: obj.message,
      data: obj.data,
    };

    const isDevelopment = process.env.NODE_ENV === 'development';
    if (isDevelopment) {
      response.error = obj.error;
      response.devError = obj.devError;
      response.devData = obj.devData;
    }
    return response;
  }

  customResponse<T>(response: IApiResponse<T>): IApiResponse<T> {
    const apiResponse: IApiResponse<T> = {
      ...response,
    };
    if (apiResponse.statusCode < 400) {
      this.winstonService.log('COMMON', apiResponse.message, {
        ...apiResponse,
      });
    } else {
      this.winstonService.error('COMMON', apiResponse.message, {
        ...apiResponse,
      });
    }
    return this.createResponse(apiResponse);
  }

  successResponse<T>(response: OmittedResponse<T>): IApiResponse<T> {
    const apiResponse: IApiResponse<T> = {
      ...response,
      status: this.getHttpStatusValues[HttpStatus.OK]!,
      statusCode: HttpStatus.OK,
    };
    this.winstonService.log('COMMON', apiResponse.message, apiResponse);
    return this.createResponse(apiResponse);
  }

  errorResponse<T>(response: OmittedResponse<T>): IApiResponse<T> {
    const apiResponse: IApiResponse<T> = {
      ...response,
      status: this.getHttpStatusValues[HttpStatus.INTERNAL_SERVER_ERROR]!,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    };
    this.winstonService.error('COMMON', apiResponse.message, apiResponse);
    return this.createResponse(apiResponse);
  }

  genericSuccessResponse<T>(
    response: OmittedResponse<T>,
    extraData?: any,
    appName: API_MODULE_NAMES = 'COMMON',
  ): IApiResponse<T> {
    const apiResponse: IApiResponse<T> = {
      ...response,
      status: this.getHttpStatusValues[HttpStatus.OK]!,
      statusCode: HttpStatus.OK,
    };

    const dataToLog = {
      ...apiResponse,
      extraData,
    };

    if (appName === 'BRANCH-X') {
      this.winstonService.log('BRANCH-X', apiResponse.message, dataToLog);
    } else if (appName === 'DIGI') {
      this.winstonService.log('DIGI', apiResponse.message, dataToLog);
    } else if (appName === 'INSTANT-PAY') {
      this.winstonService.log('INSTANT-PAY', apiResponse.message, dataToLog);
    } else {
      this.winstonService.log('COMMON', apiResponse.message, dataToLog);
    }
    return this.createResponse(apiResponse);
  }

  genericErrorResponse<T>(
    response: OmittedResponse<T>,
    extraData?: any,
    appName: API_MODULE_NAMES = 'COMMON',
  ): IApiResponse<T> {
    const apiResponse: IApiResponse<T> = {
      ...response,
      status: this.getHttpStatusValues[HttpStatus.INTERNAL_SERVER_ERROR]!,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    };

    const dataToLog = {
      ...apiResponse,
      extraData,
    };

    if (appName === 'BRANCH-X') {
      this.winstonService.error('BRANCH-X', apiResponse.message, dataToLog);
    } else if (appName === 'DIGI') {
      this.winstonService.error('DIGI', apiResponse.message, dataToLog);
    } else if (appName === 'INSTANT-PAY') {
      this.winstonService.error('INSTANT-PAY', apiResponse.message, dataToLog);
    } else {
      this.winstonService.error('COMMON', apiResponse.message, dataToLog);
    }

    return this.createResponse(apiResponse);
  }

  debugLog(msg: any, serviceName: string = 'COMMON'): void {
    this.localLogger.debug(msg, { serviceName, requestId: getRandomUUID() });
  }
}
