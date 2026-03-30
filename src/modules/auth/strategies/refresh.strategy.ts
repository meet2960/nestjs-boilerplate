import { UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { type Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { ApiConfigService } from '@/shared/services/api-config.service';

export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh-jwt') {
  constructor(configService: ApiConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.authConfig.publicKey,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    console.log('RefreshTokenStrategy.validate called');
    console.log('Payload', { sub: payload.sub, email: payload.email });

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.log('No authorization header found');
      throw new UnauthorizedException('Refresh token not provided');
    }

    const refreshToken = authHeader.replace('Bearer', '').trim();
    if (!refreshToken) {
      throw new UnauthorizedException(
        'Refresh token is empty after extraction',
      );
    }

    // const user = await this.prisma.user.findUnique({
    //   where: { id: payload.sub },
    //   select: {
    //     id: true,
    //     email: true,
    //     role: true,
    //     refreshToken: true,
    //   },
    // });

    // if (!user || !user.refreshToken) {
    //   throw new UnauthorizedException('Invalid refresh token');
    // }

    // const refreshTokenMatches = await bcrypt.compare(
    //   refreshToken,
    //   user.refreshToken,
    // );

    // if (!refreshTokenMatches) {
    //   throw new UnauthorizedException('Invalid refresh does not match');
    // }

    // return { id: user.id, email: user.email, role: user.role };
  }
}
