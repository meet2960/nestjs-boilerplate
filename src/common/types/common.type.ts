import { GlobalConfig } from '@/config/global/global-config';

/* eslint-disable @typescript-eslint/no-explicit-any */
export type Constructor<T = any, Arguments extends unknown[] = any[]> = new (
  ...arguments_: Arguments
) => T;

export type KeyOfType<Entity, U> = {
  [P in keyof Required<Entity>]: Required<Entity>[P] extends U
    ? P
    : Required<Entity>[P] extends U[]
      ? P
      : never;
}[keyof Entity];

export type Reference<T> = T;

export type StringKeys<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

export type API_MODULE_NAMES =
  (typeof GlobalConfig.API_MODULE_NAMES)[keyof typeof GlobalConfig.API_MODULE_NAMES];
