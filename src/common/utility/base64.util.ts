import { readFileSync, writeFileSync } from 'node:fs';
import { isValidJSON } from './common-utils';

/**
 * Validate Base64 string (RFC 4648 compliant)
 */
export function isValidBase64(value: string): boolean {
  if (!value || typeof value !== 'string') return false;

  // Remove whitespace (important for copied payloads)
  const sanitized = value.replaceAll(/\s+/g, '');

  const base64Regex =
    /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;

  return base64Regex.test(sanitized);
}

/**
 * Encode a UTF-8 string to Base64
 */
export function encodeStringToBase64(value: string): string {
  if (typeof value !== 'string') {
    // throw new TypeError('Value must be a string');
    return '';
  }

  return Buffer.from(value, 'utf8').toString('base64');
}

/**
 * Decode Base64 to UTF-8 string
 */
export function decodeBase64ToString(base64Str: string): string {
  if (!isValidBase64(base64Str)) {
    // throw new Error('Invalid Base64 string');
    return '';
  }

  return Buffer.from(base64Str, 'base64').toString('utf8');
}

/**
 * Encode JSON object to Base64
 */
export function encodeJsonToBase64<T extends object>(value: T): string {
  return Buffer.from(JSON.stringify(value), 'utf8').toString('base64');
}

/**
 * Decode Base64 to JSON object
 */
export function decodeBase64ToJson<T>(base64: string): T {
  if (!isValidBase64(base64)) {
    throw new Error('Invalid Base64 string');
  }

  const decodedStr = Buffer.from(base64, 'base64').toString('utf8');

  if (!isValidJSON(decodedStr)) {
    throw new Error('Decoded string is not valid JSON');
  }

  return JSON.parse(decodedStr) as T;
}

/**
 * Encode file to Base64
 */
export function encodeFileToBase64(filePath: string): string {
  try {
    const buffer = readFileSync(filePath);
    return buffer.toString('base64');
  } catch (err) {
    throw new Error(`Failed to read file: ${filePath}`);
  }
}

/**
 * Decode Base64 and write to file
 */
export function decodeBase64ToFile(
  base64: string,
  outputFilePath: string,
): void {
  if (!isValidBase64(base64)) {
    throw new Error('Invalid Base64 string');
  }

  try {
    const buffer = Buffer.from(base64, 'base64');
    writeFileSync(outputFilePath, buffer);
  } catch {
    throw new Error(`Failed to write file: ${outputFilePath}`);
  }
}

/**
 * Validate Base64 size to prevent memory abuse
 * @param maxLength length of Base64 string, NOT decoded size
 */
export function assertBase64Size(base64: string, maxLength: number): void {
  if (base64.length > maxLength) {
    throw new Error(
      `Base64 payload too large. Max allowed length is ${maxLength}`,
    );
  }
}
