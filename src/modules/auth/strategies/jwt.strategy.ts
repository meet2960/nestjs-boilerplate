import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '@/modules/api/users/users.service';
import { CaslAbilityFactory } from '@/modules/helpers/casl/casl-ability.factory/casl-ability.factory';
import { ApiConfigService } from '@/shared/services/api-config.service';
import type { IUserSession } from '@/common/entity/IUserSession';
import { ContextProvider } from '@/providers';

// import type { Cache } from 'cache-manager';
// import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ApiConfigService,
    private readonly userService: UsersService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
    // @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.authConfig.publicKey,
      ignoreExpiration: false,
      issuer: process.env.APP_URL,
      audience: process.env.APP_URL,
    });
  }

  async validate(args: IUserSession): Promise<IUserSession> {
    // TODO: Implement cache module to avoid multiple DB calls

    // const oldSession = (await this.cacheManager.get(
    //   `user:${args.user_id}:session`,
    // )) as any;
    // if (!oldSession) {
    //   throw new UnauthorizedException();
    // }

    const user = await this.userService.findOne(args.user_id);
    if (!user.data) {
      throw new UnauthorizedException();
    }
    // * Find User Role and Assigned Permissions
    const userRoleAndPermission =
      await this.userService.getUserRoleAndPermission(user.data?.role_id);
    ContextProvider.setUserInfo(userRoleAndPermission);

    // * Create CASL Ability
    const ability = this.caslAbilityFactory.createForUser(
      userRoleAndPermission.permissions,
      args,
    );
    ContextProvider.setAbility(ability);

    return args;
  }
}
