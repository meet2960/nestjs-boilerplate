/* eslint-disable @typescript-eslint/no-unsafe-argument */
import CryptoJS from 'crypto-js';
import { decodeBase64ToString, encodeStringToBase64 } from './base64.util';
import { isValidJSON } from './validate-data';

export function cryptoEncrypt(value: string) {
  const privateKey = process.env.CRYPTO_SECRET ?? '';
  const encrypted = CryptoJS.AES.encrypt(
    JSON.stringify(value),
    privateKey,
  ).toString();
  return encrypted;
}

export function cryptoDecrypt(encryptedText: string): string {
  const privateKey = process.env.CRYPTO_SECRET ?? '';
  const decrypted = CryptoJS.AES.decrypt(encryptedText, privateKey);
  if (isValidJSON(decrypted.toString(CryptoJS.enc.Utf8))) {
    return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
  }
  return '';
}

export function cryptoToBase64(string: string) {
  return encodeStringToBase64(cryptoDecrypt(string));
}
export function Base64ToCrypto(string: string) {
  return cryptoEncrypt(decodeBase64ToString(string));
}

export function encryptRequest(data: any): string {
  const cryptoSecret = process.env.CRYPTO_SECRET;

  const SECRET_KEY = cryptoSecret || 'your-32-character-secret-key';
  const IV = CryptoJS.enc.Utf8.parse(cryptoSecret || 'your-16-char-initv');

  const stringData = JSON.stringify(data);
  const encrypted = CryptoJS.AES.encrypt(
    stringData,
    CryptoJS.enc.Utf8.parse(SECRET_KEY),
    {
      iv: IV,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    },
  );
  return encrypted.toString();
}

export function decryptRequest(cipherText: string): any {
  const cryptoSecret = process.env.CRYPTO_SECRET;
  const SECRET_KEY = cryptoSecret || 'your-32-character-secret-key';
  const IV = CryptoJS.enc.Utf8.parse(cryptoSecret || 'your-16-char-initv');

  const bytes = CryptoJS.AES.decrypt(
    cipherText,
    CryptoJS.enc.Utf8.parse(SECRET_KEY),
    {
      iv: IV,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    },
  );
  const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(decryptedText);
}

export function generateSecureIV(): string {
  return CryptoJS.lib.WordArray.random(16).toString();
}

export function generateSecretKey(): string {
  return CryptoJS.lib.WordArray.random(32).toString();
}

/**
 * Converts a snake_case status string into a human-readable format with capitalized words.
 *
 * @param plaintext - The input plain text to be encrypted.
 * @param encryptionKey - The encryption key to be used for encryption (must be 32 characters).
 * @returns Encrypted text in Base64 format.
 */
export function encryptAES256CBC(plaintext: string, encryptionKey: string) {
  if (encryptionKey.length !== 32) {
    throw new Error('Encryption key must be exactly 32 characters.');
  }

  const key = CryptoJS.enc.Utf8.parse(encryptionKey);
  const iv = CryptoJS.lib.WordArray.random(16);

  const encrypted = CryptoJS.AES.encrypt(plaintext, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  const ivAndCipher = iv.concat(encrypted.ciphertext);

  return CryptoJS.enc.Base64.stringify(ivAndCipher);
}
