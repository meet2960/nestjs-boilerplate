import { Injectable } from '@nestjs/common';
import { exec } from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { promisify } from 'node:util';
import { v4 as uuidv4 } from 'uuid';
import { SocketioGateway } from '../socketio/socketio.gateway';

// TODO: add other extra from onenote
const execAsync = promisify(exec);
@Injectable()
export class CommonMethodService {
  constructor(private readonly socketioGateway: SocketioGateway) {}
  public static readonly requestContext = {};
  getRandomId() {
    return uuidv4();
  }

  getCurrentDateTime() {
    return new Date();
  }

  isValidJson(json: string) {
    try {
      JSON.parse(json);
      return true;
    } catch (error) {
      console.info('Invalid JSON:', error);
      return false;
    }
  }

  convertToBase64String(value: string) {
    const convertedString = Buffer.from(value).toString('base64');
    return convertedString;
  }

  scGateway() {
    return this.socketioGateway;
  }

  async backupDbData() {
    try {
      const dbUrl = process.env.DATABASE_URL;
      if (!dbUrl) {
        return {
          data: null,
        };
      }

      // ✅ Correct way to parse Postgres URL
      const parsed = new URL(dbUrl);

      const user = decodeURIComponent(parsed.username);
      const password = decodeURIComponent(parsed.password);
      const host = parsed.hostname;
      const port = parsed.port || '5432';
      const database = parsed.pathname.replace('/', '');

      // ✅ Ensure backup directory exists
      const backupDir = path.resolve('src/public/db-backup');
      fs.mkdirSync(backupDir, { recursive: true });

      const backupPath = path.join(
        backupDir,
        `cloud_${database}_${Date.now()}.dump`,
      );

      // ✅ pg_dump command (custom format)
      const command = `pg_dump -h ${host} -p ${port} -U ${user} -d ${database} -F c -f "${backupPath}"`;

      // ✅ Execute with env var (secure)
      await execAsync(command, {
        env: {
          ...process.env,
          PGPASSWORD: password,
        },
      });

      return {
        data: {
          file: backupPath,
        },
      };
    } catch (error: any) {
      return {
        message: 'Database backup failed',
        data: null,
        error: error?.message ?? error,
      };
    }
  }

  public isImage(mimeType: string): boolean {
    const imageMimeTypes = ['image/jpeg', 'image/png'];
    return imageMimeTypes.includes(mimeType);
  }

  public uuid(): string {
    return uuidv4();
  }

  public fileName(ext: string): string {
    return `${this.uuid()}.${ext}`;
  }
}
