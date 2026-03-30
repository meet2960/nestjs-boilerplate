import { extname } from 'node:path';
import type { INameValueObj } from '../entity/INameValue';

export function base64ToFileBuffer(base64String: string) {
  const base64Regex = /^data:([^;]+);base64,(.+)$/;

  const match = base64Regex.exec(base64String);

  if (!match) {
    return null;
  }
  const mimeType = match[1];
  const base64Data = match[2]!;

  const buffer = Buffer.from(base64Data, 'base64');
  return { buffer, mimeType };
}

export function removeFileExtension(filename: string) {
  if (!filename) {
    return filename;
  }
  return filename.replace(/\.[^/.]+$/, '');
}

export const convertBase64ToFiles = (base64Files: INameValueObj[]): File[] => {
  return base64Files.map((file) => {
    const { name, value } = file;

    // Extract content type and base64 data
    const regex = /^data:(.+);base64,(.*)$/;
    const match = regex.exec(value);

    if (!match) throw new Error('Invalid base64 format');

    const mimeType = match[1];
    const base64Data = match[2];

    if (!base64Data) {
      throw new Error('No base64 data found');
    }

    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length)
      .fill(0)
      .map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);

    return new File([byteArray], name, { type: mimeType });
  });
};

export const convertBase64ToFileBuffer = (base64Files: INameValueObj[]) => {
  return base64Files.map((file) => {
    const { name, value } = file;

    const regex = /^data:(.+);base64,(.*)$/;
    const match = regex.exec(value);
    if (!match) throw new Error('Invalid base64 format');

    const mimeType = match[1];
    const base64Data = match[2]!;

    const buffer = Buffer.from(base64Data, 'base64');

    return {
      buffer,
      name,
      mimeType,
      extension: extname(name),
    };
  });
};
