import { Injectable } from '@nestjs/common';
import { ApiConfigService } from './api-config.service';
import { base64ToFileBuffer } from '@/common/utility/file-utils';
import { getRandomStringUtils } from '@/common/utility/generator-utils';
import { getCurrentTimestampFromMoment } from '@/common/utility/moment-utils';
import { streamToBuffer } from '@/common/utility/stream-utils';
import {
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// import mime from 'mime-types';
// * AWS S3 SDK Documentation
// https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/welcome.html
// https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/javascript_s3_code_examples.html
// https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/welcome.html
// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/s3/
@Injectable()
export class AwsS3Service {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor(public configService: ApiConfigService) {
    const awsS3Config = configService.awsS3Config;
    this.bucketName = awsS3Config.bucketName || '';
    this.s3Client = new S3Client({
      region: awsS3Config.bucketRegion || '',
      credentials: {
        accessKeyId: awsS3Config.accessKeyId || '',
        secretAccessKey: awsS3Config.secretAccessKey || '',
      },
    });
  }

  // * Sanitize Filename
  private sanitizeFilename(name: string) {
    return name.replace(/[^a-zA-Z0-9._-]/g, '_');
  }

  // * Generate Presigned URL
  async generatePresignedUrl(key: string, expiresInSeconds: number = 3600) {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        // ResponseContentType: 'application/octet-stream',
        // ResponseContentDisposition: 'attachment',
      });
      const url = await getSignedUrl(this.s3Client, command, {
        expiresIn: expiresInSeconds,
      });
      return url;
    } catch (error) {
      return null;
    }
  }

  // * Upload Base64 File
  async uploadBase64(
    file_base64: string,
    options: {
      file_name: string;
      folder_path: string;
      file_mime_type?: string;
    },
  ): Promise<{ fullRes: any; key: string } | null> {
    try {
      const { file_name, folder_path, file_mime_type } = options;
      const safeName = this.sanitizeFilename(file_name || 'file');
      const uniqueFileId = `${safeName}_${getCurrentTimestampFromMoment()}_${getRandomStringUtils(8)}`;

      if (!file_base64) {
        return null;
      }

      // * Convert base64 to buffer
      const bufferData = base64ToFileBuffer(file_base64);
      if (!bufferData?.buffer) {
        return null;
      }

      const objKey = `${folder_path || 'default'}/${uniqueFileId}`;

      // * Upload to S3
      const command = new PutObjectCommand({
        Key: objKey,
        Bucket: this.bucketName,
        Body: bufferData.buffer,
        ContentType:
          file_mime_type || bufferData.mimeType || 'application/octet-stream',
      });

      const response = await this.s3Client.send(command);
      return {
        fullRes: response,
        key: uniqueFileId,
      };
    } catch (error) {
      console.log('error', error);
      return null;
    }
  }

  async objectExists(key: string): Promise<boolean> {
    try {
      await this.s3Client.send(
        new HeadObjectCommand({
          Bucket: this.bucketName,
          Key: key,
        }),
      );
      return true;
    } catch (err) {
      return false;
    }
  }

  async deleteObject(key: string): Promise<boolean> {
    try {
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key: key,
        }),
      );
      return true;
    } catch (err) {
      console.error('S3 delete error:', err);
      return false;
    }
  }

  async copyObject(sourceKey: string, destinationKey: string) {
    const command = new CopyObjectCommand({
      Bucket: this.bucketName,
      CopySource: `${this.bucketName}/${sourceKey}`,
      Key: destinationKey,
    });

    await this.s3Client.send(command);

    return { destinationKey };
  }

  async getFileAsBase64(key: string) {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });
      const response = await this.s3Client.send(command);
      if (!response.Body) {
        throw new Error('Empty S3 object');
      }

      const buffer = await streamToBuffer(response.Body as any);

      return {
        base64: buffer.toString('base64'),
        contentType: response.ContentType,
        fileName: key.split('/').pop(),
      };
    } catch (error) {
      return null;
    }
  }

  //   async uploadBinaryFile(file: Express.Multer.File, options: { key: string }) {
  //     try {
  //       const command = new PutObjectCommand({
  //         Bucket: this.bucketName,
  //         Body: file.buffer,
  //         ContentType: file.mimetype || 'application/octet-stream',
  //         Key: options.key,
  //       });
  //       const response = await this.s3.send(command);
  //       console.log('response', response);
  //       return response;
  //     } catch (error) {
  //       console.log('error', error);
  //       return null;
  //     }
  //   }
}
