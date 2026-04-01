import {
  ClassSerializerInterceptor,
  HttpStatus,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { ExpressAdapter } from '@nestjs/platform-express';
import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import { EncryptionInterceptor } from './interceptors/encrypt-response-interceptor.service';
// import { TranslationInterceptor } from './interceptors/translation-interceptor.service';
import { ApiConfigService } from './shared/services/api-config.service';
// import { TranslationService } from './shared/services/translation.service';
import { AppModule } from './app.module';
import { GlobalConfig } from './config/global/global-config';
import { ApplicationSharedData } from './config/shared-data/application-shared-data';
import { setupSwagger } from './config/swagger/setup-swagger';
import { GlobalHttpExceptionFilter } from './filters/global-http-exception.filter';
import { UnprocessableEntityExceptionFilter } from './filters/unprocessable-entity.filter';
import { EncryptResponseMiddleware } from './middlewares/encrypt-response.middleware';
import { SharedModule } from './shared/shared.module';

export async function bootstrap(): Promise<NestExpressApplication> {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
  );

  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST', 'OPTIONS'],
    optionsSuccessStatus: 204,
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Idempotency-Key',
      'User-Agent',
    ],
    credentials: true,
    maxAge: 86400,
  });
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.use(cookieParser());

  app.enable('trust proxy', true); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  app.use(helmet());

  app.setGlobalPrefix('/api');
  app.use(compression());
  app.use(morgan('combined'));
  app.enableVersioning();

  const reflector = app.get(Reflector);

  app.useGlobalFilters(
    new GlobalHttpExceptionFilter(reflector), // Handle all HTTP exceptions
    new UnprocessableEntityExceptionFilter(reflector), // For Unprocessable Entity Exception Errors
    // new QueryFailedFilter(reflector), // TODO: Fix this Query Validation, with respect to Prisma Client Errors, and then add this filter back in
  );

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(reflector),
    // new TranslationInterceptor(
    //   app.select(SharedModule).get(TranslationService),
    // ),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip unknown fields
      forbidNonWhitelisted: true,
      transform: true, // convert primitives
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      dismissDefaultMessages: true,
      exceptionFactory: (errors) => new UnprocessableEntityException(errors),
    }),
  );

  if (!ApplicationSharedData.isDevelopmentMode()) {
    app.useGlobalInterceptors(new EncryptionInterceptor()); // NestJS Interceptor
    app.use(EncryptResponseMiddleware); // Express Middleware
  }

  const configService = app.select(SharedModule).get(ApiConfigService);

  // only start nats if it is enabled
  if (configService.natsEnabled) {
    const natsConfig = configService.natsConfig;
    app.connectMicroservice({
      transport: Transport.NATS,
      options: {
        url: `nats://${natsConfig.host}:${natsConfig.port}`,
        queue: 'main_service',
      },
    });

    await app.startAllMicroservices();
  }

  if (configService.documentationEnabled) {
    setupSwagger(app);
  }

  // Starts listening for shutdown hooks
  if (!configService.isDevelopment) {
    app.enableShutdownHooks();
  }

  const port = configService.appConfig.port;
  await app.listen(port, '0.0.0.0', () => {});

  console.info(`Server Running at ${await app.getUrl()}`);
  console.info(
    `Documentation: http://localhost:${process.env.PORT}/${GlobalConfig.SWAGGER_CONFIG.documentationRoutePath}`,
  );

  return app;
}

export const nestNodeApp = bootstrap();
