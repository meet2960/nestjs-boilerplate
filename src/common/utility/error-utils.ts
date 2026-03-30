import { get } from 'lodash-es';
import { ServerResponseError } from '../classes/ServerResponeError';

export function extractErrorMessage(
  error: unknown,
  fallbackMessage: string = 'Something went wrong',
): string {
  // Case 1: custom ServerResponseError
  if (error instanceof ServerResponseError) {
    const msg = error.message?.trim();
    return msg && msg.length > 0 ? msg : fallbackMessage;
  }

  // Case 2: native Error instance
  if (error instanceof Error) {
    // const msg = error.message?.trim();
    return fallbackMessage;
  }

  // Case 3: string errors (bad API responses, throw "error")
  if (typeof error === 'string') {
    const msg = error.trim();
    return msg.length > 0 ? msg : fallbackMessage;
  }

  // Case 4: Anything else (unknown, null, undefined)
  return fallbackMessage;
}

export function serializeError(err: any) {
  return {
    name: get(err, 'name', 'Error'),
    message: get(err, 'message', 'Message not available'),
    stack: err?.stack ?? '',
    ...Object.getOwnPropertyNames(err || {}).reduce((acc: any, key) => {
      if (['name', 'message', 'stack'].includes(key)) return acc;
      acc[key] = err[key];
      return acc;
    }, {}),
  };
}
