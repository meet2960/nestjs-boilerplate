import moment from 'moment-timezone';
import { customAlphabet, nanoid } from 'nanoid';
import * as crypto from 'node:crypto';
import { v4 as uuidv4, type Version4Options } from 'uuid';
import { getCurrentTimestampFromMoment } from './moment-utils';

export function generateRandomToken() {
  return crypto.randomBytes(64).toString('hex');
}

export function hashToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function cryptoRandomUUID() {
  return crypto.randomUUID();
}

export function generateRandomNumber(digits = 6): number {
  if (!Number.isInteger(digits) || digits < 1 || digits > 10) {
    throw new Error('OTP length must be between 1 and 10 digits');
  }
  const min = 10 ** (digits - 1);
  const max = 10 ** digits;
  return crypto.randomInt(min, max);
}

const nanoOnlyAlphabets = customAlphabet(
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
  10,
);
export function generateAlphabetCode(length?: number) {
  return nanoOnlyAlphabets(length);
}

export function getRandomStringUtils(length?: number) {
  return nanoid(length);
}

export function getRandomUUID(
  options?: Version4Options | undefined,
  buf?: undefined,
  offset?: number,
) {
  return uuidv4(options, buf, offset);
}

export function generateRequestId() {
  const uniqueRequestId = `REQ_${getCurrentTimestampFromMoment()}_${getRandomUUID().slice(0, 8)}`;
  return uniqueRequestId;
}

export function generateNumericRequestId(): number {
  const datePart = Number(moment().format('YYYYMMDD')); // e.g., 20250815
  const randomPart = Math.floor(100000 + Math.random() * 900000); // 6-digit random number
  return Number(`${datePart}${randomPart}`); // combine and convert to number
}

export function generateNUuid(length: number) {
  const uuids = Array.from({ length })
    .fill('1')
    .map((_) => getRandomUUID());
  return uuids;
}

export function generateTimeStampSeconds() {
  const timestamp = Math.floor(Date.now() / 1000);
  return timestamp;
}

export function getRandomNumber() {
  const random = Math.round(Math.random() * 1_000_000_000);
  return random;
}

export function getJwtExpirationTime(minutes: number): number {
  return minutes * 60; // Convert minutes to seconds
}

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export function maskAccountNumber(accountNumber: string) {
  const accountNumberString = String(accountNumber);
  const lastFourDigits = accountNumberString.slice(-4);

  const maskedAccountNumber =
    '*'.repeat(accountNumberString.length - 4) + lastFourDigits;

  return maskedAccountNumber;
}

export function generatePassword({
  length = 12,
  includeLower = true,
  includeUpper = true,
  includeDigits = true,
  includeSymbols = true,
}: {
  length?: number;
  includeLower?: boolean;
  includeUpper?: boolean;
  includeDigits?: boolean;
  includeSymbols?: boolean;
} = {}): string {
  const LOWER = 'abcdefghijklmnopqrstuvwxyz';
  const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const DIGITS = '0123456789';
  const SYMBOLS = '!@#$%^&*()=+[]{}?';

  if (length < 8 || length > 64) {
    throw new Error('Password length must be between 8 and 64 characters');
  }

  const pools: string[] = [];
  if (includeLower) pools.push(LOWER);
  if (includeUpper) pools.push(UPPER);
  if (includeDigits) pools.push(DIGITS);
  if (includeSymbols) pools.push(SYMBOLS);

  if (pools.length === 0) {
    throw new Error('At least one character set must be enabled');
  }

  const allChars = pools.join('');
  const password: string[] = [];

  for (const pool of pools) {
    password.push(pool.charAt(crypto.randomInt(0, pool.length)));
  }

  while (password.length < length) {
    password.push(allChars.charAt(crypto.randomInt(0, allChars.length)));
  }

  for (let i = password.length - 1; i > 0; i--) {
    const j = crypto.randomInt(0, i + 1);
    const a = password[i];
    const b = password[j];
    if (a === undefined || b === undefined) continue;
    [password[i], password[j]] = [b, a];
  }
  return password.join('');
}
