import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { AuthService } from './auth.service';
// import { LoginHistoryModule } from '../api/admin/login-history/login-history.module';
// import { UserSessionModule } from '../api/user-session/user-session.module';
// import { UsersModule } from '../api/users/users.module';
import { AuthController } from './auth.controller';
import { PublicStrategy } from './public.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Global()
@Module({
  imports: [
    // forwardRef(() => UsersModule),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: (configService: ApiConfigService) => ({
        privateKey: configService.authConfig.privateKey,
        publicKey: configService.authConfig.publicKey,
        signOptions: {
          algorithm: 'RS256',
          expiresIn: configService.authConfig.jwtExpirationTime,
          issuer: process.env.APP_URL,
          audience: process.env.APP_URL,
        },
        verifyOptions: {
          algorithms: ['RS256'],
          ignoreExpiration: false,
          issuer: process.env.APP_URL,
          audience: process.env.APP_URL,
        },
      }),
      inject: [ApiConfigService],
    }),
    // LoginHistoryModule,
    // UserSessionModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, PublicStrategy],
  exports: [JwtModule, AuthService],
})
export class AuthModule {}
