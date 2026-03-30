import { cryptoDecrypt, cryptoEncrypt } from './encryption-utils';

export function urlParamsEncrypt(password: string | null) {
  try {
    if (password) {
      const encryptedValue = cryptoEncrypt(password);
      const encodedUrl = encodeURIComponent(encryptedValue);
      return encodedUrl;
    }
    return password;
  } catch (error) {
    return password;
  }
}

export function urlParamsDecrypt(password: string) {
  try {
    if (!password) return password;
    const decoded = decodeURIComponent(password);
    const res = cryptoDecrypt(decoded);
    return res;
  } catch (error) {
    return null;
  }
}
