import { Global, Injectable } from '@nestjs/common';
import { get } from 'lodash-es';
import * as util from 'node:util';
import * as winston from 'winston';
import type { API_MODULE_NAMES } from '@/config/global/global-config-types';
import { serializeError } from '@/common/utility/error-utils';
import { createCustomWinstonLogger } from '@/common/utility/winston-utils';
import { ContextProvider } from '@/providers';
import { SocketioGateway } from '../socketio/socketio.gateway';

const { combine, timestamp, printf, colorize, align, json } = winston.format;

@Global()
@Injectable()
export class WinstonLoggerService {
  private readonly mainConsoleLogger: winston.Logger;

  private readonly commonLogger: winston.Logger;
  private readonly digiSevaLogger: winston.Logger;
  private readonly branchXLogger: winston.Logger;
  private readonly instantPayLogger: winston.Logger;

  constructor(private readonly socketioGateway: SocketioGateway) {
    this.mainConsoleLogger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: combine(timestamp(), json()),
      transports: [
        new winston.transports.Console({
          format: combine(
            colorize({ all: true }),
            timestamp({
              format: 'YYYY-MM-DD hh:mm:ss.SSS A',
            }),
            align(),
            printf(
              (info) =>
                `[${info.timestamp}] ${info.level}: ${util.inspect(info, {
                  depth: null,
                  colors: true,
                  showHidden: true,
                  showProxy: true,
                  maxArrayLength: null,
                  maxStringLength: 100,
                  breakLength: 60,
                  compact: false,
                  sorted: true,
                })}`,
            ),
          ),
        }),
      ],
    });

    // * Common Logger
    this.commonLogger = createCustomWinstonLogger('common', {
      defaultMetadata: {
        service: 'Common APIs',
      },
    });

    // * Logger for DIGI
    this.digiSevaLogger = createCustomWinstonLogger('digi-seva', {
      defaultMetadata: {
        service: 'Digi Seva APIs',
      },
    });

    // * Logger for Branch-X
    this.branchXLogger = createCustomWinstonLogger('branch-x', {
      defaultMetadata: {
        service: 'Branch X APIs',
      },
    });

    // * Logger for Instant-Pay
    this.instantPayLogger = createCustomWinstonLogger('instant-pay', {
      defaultMetadata: {
        service: 'Instant Pay APIs',
      },
    });
  }

  private getRequestContext() {
    const requestContext = ContextProvider.getRequestContext();
    const authUser = ContextProvider.getAuthUser();
    const requestId = ContextProvider.getClsService().getId();

    const requestInfo = {
      internalRequestId: requestId,
      ...requestContext,
      user: {
        user_id: get(authUser, 'user_id', ''),
        user_name: get(authUser, 'user_name', ''),
        role_code: get(authUser, 'role_code', ''),
        role_id: get(authUser, 'role_id', ''),
      },
    };
    return requestInfo;
  }

  log(
    serviceName: API_MODULE_NAMES,
    message: string,
    data: any,
    _wType: 'logger' | 'console' = 'logger',
  ) {
    const finalData = {
      ...data,
      requestInfo: this.getRequestContext(),
    };

    if (_wType === 'console') {
      this.mainConsoleLogger.info('Info:', data);
      return;
    }
    if (serviceName === 'COMMON') {
      this.commonLogger.info(message, finalData);
    } else if (serviceName === 'DIGI') {
      this.digiSevaLogger.info(message, finalData);
    } else if (serviceName === 'BRANCH-X') {
      this.branchXLogger.info(message, finalData);
    } else if (serviceName === 'INSTANT-PAY') {
      this.logSocketEvent(finalData);
      this.instantPayLogger.info(message, finalData);
    }
  }

  error(
    serviceName: API_MODULE_NAMES,
    message: string,
    data: any,
    _wType: 'logger' | 'console' = 'logger',
  ) {
    const { error, ...rest } = data;
    const finalData = {
      ...rest,
      requestInfo: this.getRequestContext(),
      error: serializeError(error),
    };

    if (_wType === 'console') {
      this.mainConsoleLogger.error('Error:', message);
    }

    if (serviceName === 'COMMON') {
      this.commonLogger.error(message, finalData);
    } else if (serviceName === 'DIGI') {
      this.digiSevaLogger.error(message, finalData);
    } else if (serviceName === 'BRANCH-X') {
      this.branchXLogger.error(message, finalData);
    } else if (serviceName === 'INSTANT-PAY') {
      this.instantPayLogger.error(message, finalData);
    }
  }

  warn(message: any) {
    this.commonLogger.warn('Warn', message);
  }

  debug(message: any) {
    this.commonLogger.debug('Debug', message);
  }

  verbose(message: any) {
    this.commonLogger.verbose(message);
  }

  logSocketEvent(data: any) {
    this.socketioGateway.sendLog(JSON.stringify(data, null, 2));
  }
}
