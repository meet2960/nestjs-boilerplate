import { randomUUID } from 'crypto';
import { extname } from 'node:path';
import { Readable } from 'stream';
import type { INameValueObj } from '../schemas/name-value.schema';

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

export const streamToBuffer = async (stream: Readable): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
};

export const FILE_LIMITS = {
  avatar: 2 * 1024 * 1024, // 2 MB
  document: 5 * 1024 * 1024, // 5 MB
  largeDocument: 25 * 1024 * 1024,
} as const;

export const S3_PRESIGNED_URL_EXPIRY = {
  ONE_HOUR: 60 * 60,
  SIX_HOURS: 6 * 60 * 60,
  TWELVE_HOURS: 12 * 60 * 60,
  ONE_DAY: 24 * 60 * 60,
  SEVEN_DAYS: 7 * 24 * 60 * 60,
} as const;

export const FOLDER_SEGMENTS = {
  clients: 'clients',
  users: 'users',
  tickets: 'tickets',
  properties: 'properties',
  units: 'units',
  assets: 'assets',
  amenities: 'amenities',
} as const;

export class MediaFileHelper {
  static sanitizeFileName(name: string): string {
    return name
      .normalize('NFKC')
      .replace(/[^\w.\- ()]/g, '_')
      .replace(/\.{2,}/g, '.')
      .slice(0, 255);
  }

  private static joinPath(...parts: Array<string | number | bigint>): string {
    return parts
      .map(String)
      .map((part) => part.replace(/^\/+|\/+$/g, ''))
      .filter(Boolean)
      .join('/');
  }

  static generateFileName(originalName: string): string {
    const ext = extname(originalName)
      .toLowerCase()
      .replace(/[^a-z0-9.]/g, '');
    const safeExt = /^\.[a-z0-9]{1,10}$/.test(ext) ? ext : '';
    const uniqueFileName = `${randomUUID()}${safeExt}`;
    return uniqueFileName;
  }

  static generateUserAvatarFolderPath(
    clientId: number | bigint,
    userId: number | bigint,
    fileName: string,
  ): string {
    return this.joinPath(
      FOLDER_SEGMENTS.clients,
      clientId,
      FOLDER_SEGMENTS.users,
      userId,
      fileName,
    );
  }

  static generatePropertyDocumentFolderPath(
    clientId: number | bigint,
    propertyId: number | bigint,
    fileName: string,
  ): string {
    return this.joinPath(
      FOLDER_SEGMENTS.clients,
      clientId,
      FOLDER_SEGMENTS.properties,
      propertyId,
      fileName,
    );
  }

  static generatePropertyUnitAssetDocumentFolderPath(
    clientId: number | bigint,
    propertyId: number | bigint,
    unitId: number | bigint,
    fileName: string,
  ): string {
    return this.joinPath(
      FOLDER_SEGMENTS.clients,
      clientId,
      FOLDER_SEGMENTS.properties,
      propertyId,
      FOLDER_SEGMENTS.units,
      unitId,
      FOLDER_SEGMENTS.assets,
      fileName,
    );
  }

  static generatePropertyAmenityDocumentFolderPath(
    clientId: number | bigint,
    propertyId: number | bigint,
    amenityId: number | bigint,
    fileName: string,
  ): string {
    return this.joinPath(
      FOLDER_SEGMENTS.clients,
      clientId,
      FOLDER_SEGMENTS.properties,
      propertyId,
      FOLDER_SEGMENTS.amenities,
      amenityId,
      fileName,
    );
  }

  static generateTicketDocumentPath(
    clientId: number | bigint,
    propertyId: number | bigint,
    ticketId: number | bigint,
    fileName: string,
  ): string {
    return this.joinPath(
      FOLDER_SEGMENTS.clients,
      clientId,
      FOLDER_SEGMENTS.properties,
      propertyId,
      FOLDER_SEGMENTS.tickets,
      ticketId,
      fileName,
    );
  }
}
