import _ from 'lodash';

/**
 * Converts a snake_case status string into a human-readable format with capitalized words.
 *
 * @param str - The input string in snake_case format (e.g., "under_review").
 * @returns A formatted string with spaces and capitalized words (e.g., "Under Review").
 *
 * @example
 * formatStatusName("under_review"); // "Under Review"
 * formatStatusName("pending_submission"); // "Pending Submission"
 */
export function formatSnakeCaseToTitle(str: string) {
  return str
    .split('_')
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)) // capitalize each word
    .join(' ');
}

/**
 * Safely converts a value to a number.
 * Returns 0 if the value is not a valid number.
 */
export function safeToNumber(value: any): number {
  const num = _.toNumber(value);
  return _.isNaN(num) ? 0 : num;
}

export const jwtExpiryInSeconds = {
  minutes: (v: number) => v * 60,
  hours: (v: number) => v * 60 * 60,
  days: (v: number) => v * 60 * 60 * 24,
};

export function checkIsValidNumber(value: string | number | null | undefined) {
  if (typeof value === 'number') {
    const numberVariable = Number.isNaN(Number(value)) ? 0 : Number(value);
    return numberVariable;
  }
  if (typeof value === 'string') {
    const numberVariable = Number.isNaN(Number(value)) ? 0 : Number(value);
    return numberVariable === 0 ? null : numberVariable;
  }
  return null;
}

export function isValidJSON(json: string) {
  try {
    if (typeof json !== 'string') {
      return false;
    }
    JSON.parse(json);
    return true;
  } catch (error) {
    return false;
  }
}
