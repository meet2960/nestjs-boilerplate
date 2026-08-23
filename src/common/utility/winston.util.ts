import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

// type LogLevel =
//   | 'error'
//   | 'warn'
//   | 'info'
//   | 'http'
//   | 'verbose'
//   | 'debug'
//   | 'silly';

export const maxFileRetainDays = '14d'; // Retain logs for 14 days
export const maxFileSize = '20m'; // Max size of log file before rotation

const { combine, timestamp, json, errors, splat } = winston.format;

export const filterOnly = (level: string) =>
  winston.format((info) => (info.level === level ? info : false))();

export const baseWinstonDataFormat = combine(
  errors({ stack: true }),
  splat(),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  json({ space: 2, deterministic: true }),
);

// Function to create a Winston logger instance
export function createCustomWinstonLogger(
  serviceName: string,
  options?: winston.LoggerOptions,
) {
  const { defaultMeta } = options || {};

  const logger = winston.createLogger({
    level: 'info',
    defaultMeta: defaultMeta,
    transports: [
      new DailyRotateFile({
        filename: `logs/day-%DATE%/${serviceName}/info-%DATE%.log`,
        datePattern: 'YYYY-MM-DD',
        json: true,
        watchLog: true,
        level: 'info',
        zippedArchive: true,
        maxSize: maxFileSize,
        maxFiles: maxFileRetainDays,
        format: combine(filterOnly('info'), baseWinstonDataFormat),
      }),
      new DailyRotateFile({
        filename: `logs/day-%DATE%/${serviceName}/error-%DATE%.log`,
        datePattern: 'YYYY-MM-DD',
        json: true,
        watchLog: true,
        level: 'error',
        zippedArchive: true,
        maxSize: maxFileSize,
        maxFiles: maxFileRetainDays,
        format: combine(filterOnly('error'), baseWinstonDataFormat),
      }),
    ],
  });

  return logger;
}
