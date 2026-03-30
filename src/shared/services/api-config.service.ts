import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { ThrottlerOptions } from '@nestjs/throttler';
import path from 'node:path';
import parse from 'parse-duration';
import { SnakeNamingStrategy } from '@/config/typeorm/snake-naming.strategy';
import { CustomTypeormLogger } from '@/config/typeorm/typeorm-logger';

@Injectable()
export class ApiConfigService {
  constructor(private configService: ConfigService) {}

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get isTest(): boolean {
    return this.nodeEnv === 'test';
  }

  private getNumber(key: string): number {
    const value = this.get(key);
    const num = Number(value);

    if (Number.isNaN(num)) {
      throw new Error(
        `Environment variable ${key} must be a number. Received: ${value}`,
      );
    }

    return num;
  }

  private getDuration(
    key: string,
    format?: Parameters<typeof parse>[1],
  ): number {
    const value = this.getString(key);
    const duration = parse(value, format);

    if (duration === null) {
      throw new Error(
        `Environment variable ${key} must be a valid duration. Received: ${value}`,
      );
    }

    return duration;
  }

  private getBoolean(key: string): boolean {
    const value = this.get(key);

    try {
      return Boolean(JSON.parse(value));
    } catch {
      throw new Error(
        `Environment variable ${key} must be a boolean. Received: ${value}`,
      );
    }
  }

  private getString(key: string): string {
    const value = this.get(key);
    return value.replaceAll(String.raw`\n`, '\n');
  }

  get nodeEnv(): string {
    return this.getString('NODE_ENV');
  }

  get fallbackLanguage(): string {
    return this.getString('FALLBACK_LANGUAGE');
  }

  get throttlerConfigs(): ThrottlerOptions {
    return {
      ttl: this.getDuration('THROTTLER_TTL', 'second'),
      limit: this.getNumber('THROTTLER_LIMIT'),
      // storage: new ThrottlerStorageRedisService(new Redis(this.redis)),
    };
  }

  get postgresConfig() {
    const entities = [
      path.join(import.meta.dirname, `../../modules/**/*.entity{,.js}`),
      path.join(import.meta.dirname, `../../modules/**/*.view-entity{,.js}`),
    ];

    return {
      entities: [...entities],
      dropSchema: this.isTest,
      type: 'postgres',
      host: this.getString('DB_HOST'),
      port: this.getNumber('DB_PORT'),
      username: this.getString('DB_USERNAME'),
      password: this.getString('DB_PASSWORD'),
      database: this.getString('DB_DATABASE'),
      schema: this.getString('DB_SCHEMA'),
      migrationsRun: false,
      applicationName: 'payments-app',
      synchronize: false,
      logging: this.getBoolean('ENABLE_ORM_LOGS'),
      namingStrategy: new SnakeNamingStrategy(),
      logger: new CustomTypeormLogger(),
      extra: {
        options: `-c search_path=${this.getString('DB_SCHEMA')}`,
      },
    };
  }

  get awsS3Config() {
    return {
      bucketRegion: this.getString('AWS_S3_BUCKET_REGION'),
      bucketApiVersion: this.getString('AWS_S3_API_VERSION'),
      bucketName: this.getString('AWS_S3_BUCKET_NAME'),
      secretAccessKey: this.getString('AWS_S3_SECRET_ACCESS_KEY'),
      accessKeyId: this.getString('AWS_S3_ACCESS_KEY_ID'),
    };
  }

  get resendConfig() {
    return {
      apiKey: this.getString('RESEND_API_KEY'),
    };
  }

  get documentationEnabled(): boolean {
    return this.getBoolean('ENABLE_DOCUMENTATION');
  }

  get natsEnabled(): boolean {
    return this.getBoolean('NATS_ENABLED');
  }

  get natsConfig() {
    return {
      host: this.getString('NATS_HOST'),
      port: this.getNumber('NATS_PORT'),
    };
  }

  get authConfig() {
    return {
      privateKey: this.getString('JWT_PRIVATE_KEY'),
      publicKey: this.getString('JWT_PUBLIC_KEY'),
      jwtExpirationTime: this.getNumber('JWT_EXPIRATION_TIME'),
    };
  }

  get appConfig() {
    return {
      port: this.getString('PORT'),
    };
  }

  get branchXApiConfig() {
    return {
      baseUrl: this.getString('BRANCH_X_API_BASE_URL'),
      apiToken: this.getString('BRANCH_X_API_TOKEN'),
    };
  }

  get instantPayApiConfig() {
    return {
      baseUrl: this.getString('INSTANT_PAY_API_BASE_URL'),
      authCode: this.getString('INSTANT_PAY_API_AUTH_CODE'),
      clientId: this.getString('INSTANT_PAY_API_CLIENT_ID'),
      encryptionKey: this.getString('INSTANT_PAY_API_ENCRYPTION_KEY'),
      clientSecret: this.getString('INSTANT_PAY_API_CLIENT_SECRET'),
      outletId: this.getString('INSTANT_PAY_API_OUTLET_ID'),
      endpointIp: this.getString('INSTANT_PAY_API_ENDPOINT_IP'),
    };
  }

  get digiSevaApiConfig() {
    return {
      baseUrl: this.getString('DIGI_SEVA_API_BASE_URL'),
      apiKey: this.getString('DIGI_SEVA_API_KEY'),
      apiUserCode: this.getString('DIGI_SEVA_API_USER_CODE'),
      apiAccessMode: this.getString('DIGI_SEVA_API_ACCESS_MODE'),
      apiPartnerId: this.getNumber('DIGI_SEVA_API_PARTNER_ID'),
      apiThankYouPageRedirectUrl: this.getString(
        'DIGI_SEVA_API_THANKYOU_PAGE_REDIRECT_URL',
      ),
    };
  }

  private get(key: string): string {
    const value = this.configService.get<string>(key);

    if (value == null) {
      throw new Error(`Environment variable ${key} is not set`);
    }

    return value;
  }
}
