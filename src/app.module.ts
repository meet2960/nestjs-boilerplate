import { CacheModule } from '@nestjs/cache-manager';
import { Module, RequestMethod, type MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerModule } from '@nestjs/throttler';
import { type Response } from 'express';
import { ClsModule, ClsMiddleware } from 'nestjs-cls';
import path from 'node:path';
import { AppService } from './app.service';
import { ApiConfigService } from './shared/services/api-config.service';
import { AppController } from './app.controller';
import { excludeRoutesFromMiddleware } from './common/constants/exclude-route-list';
import { LoggerMiddleware } from './middlewares';
import { AuthModule } from './modules/auth/auth.module';
import { HealthCheckerModule } from './modules/health-checker/health-checker.module';
import { CaslModule } from './modules/helpers/casl/casl.module';
import { PrismadbModule } from './modules/helpers/prismadb/prismadb.module';
import { ResponseTypeModule } from './modules/helpers/response-type/response-type.module';
import { SocketioModule } from './modules/helpers/socketio/socketio.module';
import { WinstonLoggerModule } from './modules/helpers/winston-logger/winston-logger.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    CacheModule.register({
      ttl: 6 * 60 * 60 * 1000, // 6 hours in milliseconds
      isGlobal: true,
    }),
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
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'logs'),
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
      rootPath: path.join(__dirname, '..', 'public'),
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
    HealthCheckerModule,
    ResponseTypeModule,
    WinstonLoggerModule,
    SocketioModule,
    CaslModule,
    AuthModule,
    PrismadbModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ClsMiddleware, LoggerMiddleware)
      .exclude(...excludeRoutesFromMiddleware)
      .forRoutes({ path: '*path', method: RequestMethod.ALL });
  }
}
