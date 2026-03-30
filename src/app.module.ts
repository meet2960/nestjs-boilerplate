import { Module, RequestMethod, type MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerModule } from '@nestjs/throttler';
import { type Response } from 'express';
import { ClsModule, ClsMiddleware } from 'nestjs-cls';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import path from 'node:path';
import { AppService } from './app.service';
import { ApiConfigService } from './shared/services/api-config.service';
import { AppController } from './app.controller';
import { excludeRoutesFromMiddleware } from './common/constants/exclude-route-list';
import { LoggerMiddleware } from './middlewares';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
        generateId: true,
      },
    }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: ApiConfigService) => ({
        throttlers: [configService.throttlerConfigs],
      }),
      inject: [ApiConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    I18nModule.forRootAsync({
      useFactory: (configService: ApiConfigService) => ({
        fallbackLanguage: configService.fallbackLanguage,
        loaderOptions: {
          path: path.join(import.meta.dirname, 'i18n/'),
          watch: configService.isDevelopment,
        },
      }),
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
        new HeaderResolver(['x-lang']),
      ],
      imports: [SharedModule],
      inject: [ApiConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(import.meta.dirname, '..', 'logs'),
      serveRoot: '/logs',
      serveStaticOptions: {
        fallthrough: true,
        index: false,
        redirect: false,
        setHeaders: (res: Response) => {
          res.setHeader('Cache-Control', 'no-store');
        },
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(import.meta.dirname, '..', 'public'),
      serveRoot: '/public',
      serveStaticOptions: {
        fallthrough: true,
        index: false,
        redirect: false,
        setHeaders: (res: Response) => {
          res.setHeader('Cache-Control', 'no-store');
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ClsMiddleware, LoggerMiddleware)
      .exclude(...excludeRoutesFromMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
