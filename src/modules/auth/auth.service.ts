/* eslint-disable unicorn/numeric-separators-style */
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Cache } from 'cache-manager';
import { addDays, isAfter } from 'date-fns';
import type { Request, Response } from 'express';
import type { Algorithm } from 'jsonwebtoken';
import { cloneDeep, get } from 'lodash-es';
import { LoginHistoryService } from '../api/admin/login-history/login-history.service';
import { UserSessionService } from '../api/user-session/user-session.service';
import { UsersService } from '../api/users/users.service';
import { ResponseTypeService } from '../helpers/response-type/response-type.service';
import { ApiConfigService } from '@/shared/services/api-config.service';
import { ApplicationSharedData } from '@/config/shared-data/application-shared-data';
import { ServerResponseError } from '@/common/classes/ServerResponeError';
import type { IUserSession } from '@/common/entity/IUserSession';
import { getCurrentDateTime } from '@/common/utility/date-utils';
import { cryptoDecrypt } from '@/common/utility/encryption-utils';
import { extractErrorMessage } from '@/common/utility/error-utils';
import {
  generateRandomToken,
  getRandomUUID,
  hashToken,
} from '@/common/utility/generator-utils';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ChangeTpinDto } from './dto/change-tpin.dto';
import { GenerateTokenDto } from './dto/generate-token.dto';
import { TokenPayloadDto } from './dto/token-payload.dto';
import { type UserLoginDto } from './dto/user-login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import type { LoginHistoryEntity } from '../api/admin/login-history/entities/login-history.entity';
import { CreateUserDto } from '../api/users/dto/create-user.dto';
import type {
  ICreateLoginHistoryRecord,
  TokenCreationPayload,
} from './types/types';

@Injectable()
export class AuthService {
  constructor(
    private readonly responseType: ResponseTypeService,
    private readonly jwtService: JwtService,
    private readonly configService: ApiConfigService,
    private readonly userService: UsersService,
    private readonly loginHistoryService: LoginHistoryService,
    private readonly userSessionService: UserSessionService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  private async createLoginHistoryRecord(data: ICreateLoginHistoryRecord) {
    const userIpAddress = String(
      get(data.request.headers, 'x-forwarded-for', data.request.ip),
    );

    const userLoginHistoryPayload: LoginHistoryEntity = {
      login_history_id: 0,
      created_by: get(data.user, 'user_id', null),
      created_date: getCurrentDateTime(),
      user_id: get(data.user, 'user_id', null),
      event_type: data.extraInfo.event_type,
      ip_address: userIpAddress,
      user_agent: String(data.request.headers['user-agent']),
      device_type: data.extraInfo.device_type,
      latitude: data.extraInfo.latitude,
      longitude: data.extraInfo.longitude,
      meta_info: data.extraInfo.meta_info,
    };
    const loginUserHistory = await this.loginHistoryService.create(
      userLoginHistoryPayload,
    );
    return loginUserHistory;
  }

  private removeRefreshTokenCookie(res: Response) {
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/api/auth',
    });
  }

  async generateToken(payload: GenerateTokenDto, _secretKey: string) {
    const token = await this.jwtService.signAsync(payload.data, {
      algorithm: payload.algorithm as Algorithm,
      secret: payload.secretKey,
    });
    return this.responseType.successResponse({
      data: token,
      message: 'Token Created Successfully',
    });
  }

  private async generateAccessToken(data: TokenCreationPayload) {
    const tokenPayload: TokenCreationPayload = {
      user_id: data.user_id,
      role_id: data.role_id,
      user_name: data.user_name,
      role_code: data.role_code,
      session_id: data.session_id,
      //   type: TokenType.ACCESS_TOKEN,
    };

    const expirationTIme = this.configService.authConfig.jwtExpirationTime;
    const createdToken = new TokenPayloadDto({
      expiresIn: expirationTIme,
      token: await this.jwtService.signAsync(tokenPayload, {
        expiresIn: expirationTIme,
      }),
    });

    return createdToken;
  }

  private async getUserByEmail(email: string) {
    const user = await this.userService.userRepository.findOne({
      where: {
        email_id: email,
      },
      relations: ['parent_user'],
    });
    return user;
  }

  async loginUser(data: UserLoginDto, req: Request, res: Response) {
    try {
      const user = await this.getUserByEmail(data.email);

      // * If User Not Found, then also create an entry in Login History Table with user_id as null and event_type as user_not_found for tracking the login attempts with invalid email ids and then return the response
      if (!user) {
        // * Add New Entry in Login History Table for User Not Found Event
        await this.createLoginHistoryRecord({
          request: req,
          user,
          extraInfo: {
            event_type: 'user_not_found',
            device_type: get(data.extra_info, 'device_type', ''),
            latitude: get(data.extra_info, 'latitude', ''),
            longitude: get(data.extra_info, 'longitude', ''),
            meta_info: JSON.stringify({
              title: 'User Not Found',
              payload: {
                actual_email: data.email,
                actual_password: data.password,
              },
            }),
          },
        });

        return this.responseType.customResponse({
          data: null,
          message: 'User Not Found',
          status: 'NOT_FOUND',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }

      // * Password Decryption - Only for Development Purposes, In Production the Password should be Encrypted and compared in Encrypted Format
      const shouldDecrypt = false; // For Development Purposes only
      const decryptedPassword = shouldDecrypt
        ? cryptoDecrypt(data.password)
        : data.password;

      const isPasswordValid = user.user_password === decryptedPassword;

      if (!isPasswordValid) {
        await this.createLoginHistoryRecord({
          request: req,
          user,
          extraInfo: {
            event_type: 'invalid_credentials',
            device_type: get(data.extra_info, 'device_type', ''),
            latitude: get(data.extra_info, 'latitude', ''),
            longitude: get(data.extra_info, 'longitude', ''),
            meta_info: JSON.stringify({
              title: 'Invalid User Credentials',
            }),
          },
        });
        return this.responseType.errorResponse({
          data: null,
          message: 'Invalid Credentials',
        });
      }

      if (!user.is_active) {
        await this.createLoginHistoryRecord({
          request: req,
          user,
          extraInfo: {
            event_type: 'user_not_active',
            device_type: get(data.extra_info, 'device_type', ''),
            latitude: get(data.extra_info, 'latitude', ''),
            longitude: get(data.extra_info, 'longitude', ''),
            meta_info: JSON.stringify({
              title: 'User is Not Active',
            }),
          },
        });
        return this.responseType.errorResponse({
          data: null,
          message: 'User is Not Active',
        });
      }

      // * Add New Entry in Login History Table
      await this.createLoginHistoryRecord({
        request: req,
        user,
        extraInfo: {
          event_type: 'login_success',
          device_type: get(data.extra_info, 'device_type', ''),
          latitude: get(data.extra_info, 'latitude', ''),
          longitude: get(data.extra_info, 'longitude', ''),
          meta_info: JSON.stringify({
            title: 'User Logged In Successfully',
          }),
        },
      });

      // * Find User Role and Permissions
      const userRoleAndPermission =
        await this.userService.getUserRoleAndPermission(user.role_id);

      // * Prepare User Data to Store in Cache and Send in Response
      const { user_password, user_tpin, ...restUser } = user;

      const userData = {
        user_info: {
          ...restUser,
        },
        role: userRoleAndPermission.role,
        page_permissions: userRoleAndPermission.permissions,
      };

      const sessionId = getRandomUUID();

      // * Create Access Token
      const tokenPayload: TokenCreationPayload = {
        user_id: userData.user_info.user_id,
        role_id: userData.user_info.role_id,
        user_name: userData.user_info.user_name,
        role_code: userRoleAndPermission.role ?? '',
        session_id: sessionId,
      };
      const accessToken = await this.generateAccessToken(
        cloneDeep(tokenPayload),
      );

      // * Create Refresh Token
      const refreshToken = generateRandomToken();

      // * Create User Session
      const newSession = await this.userSessionService.create({
        user_session_id: 0,
        user_id: user.user_id,
        session_id: sessionId,
        session_token: hashToken(accessToken.token),
        refresh_token: hashToken(refreshToken),
        expires_at: addDays(new Date(), 7),
        is_revoked: false,
        revoked_at: null,
        created_by: get(user, 'user_id'),
        created_date: getCurrentDateTime(),
      });

      if (!newSession.data) {
        throw new ServerResponseError('Something Went Wrong, Please Try Again');
      }

      // * Create Final Response Object
      const finalResponse = {
        ...userData,
        access_token: accessToken.token,
        session_id: newSession.data.session_id,
      };

      // * Store User Session in Cache in Local
      await this.cacheManager.set(
        ApplicationSharedData.getSessionCacheKey(
          finalResponse.user_info.user_id,
        ),
        finalResponse,
      );

      // * Set Refresh Token in HttpOnly Cookie
      res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/api/auth',
        maxAge: 1000 * 60 * 60 * 24 * 30,
      });

      return this.responseType.successResponse({
        data: finalResponse,
        message: 'User LoggedIn Successfully',
      });
    } catch (error) {
      const errorMessage = extractErrorMessage(error, 'Failed to Login User');
      await this.createLoginHistoryRecord({
        request: req,
        user: null,
        extraInfo: {
          event_type: 'login_failed',
          device_type: get(data.extra_info, 'device_type', ''),
          latitude: get(data.extra_info, 'latitude', ''),
          longitude: get(data.extra_info, 'longitude', ''),
          meta_info: JSON.stringify({
            title: 'Login Failed',
            payload: {
              actual_email: data.email,
              actual_password: data.password,
            },
            error: errorMessage,
          }),
        },
      });

      return this.responseType.errorResponse({
        error,
        data: null,
        message: 'Login Failed',
      });
    }
  }

  async logout(_data: Record<string, unknown>, req: Request, res: Response) {
    // TODO: Get the Session UUID from the Request, find the User Session from table, and update the revoved_at and is_revoked fields from the table and then delete the session from cache and then return the response

    const refreshToken = req.cookies['refresh_token'];
    if (!refreshToken) {
      return this.responseType.successResponse({
        message: 'Logout Successfully',
        data: null,
      });
    }
    const hash = hashToken(refreshToken);

    const session = await this.userSessionService.userSessionRepository.findOne(
      {
        where: { refresh_token: hash },
      },
    );

    if (session) {
      session.is_revoked = true;
      session.revoked_at = getCurrentDateTime();
      await this.userSessionService.userSessionRepository.save(session);
    }

    await this.cacheManager.del(
      ApplicationSharedData.getSessionCacheKey(session?.user_id ?? 0),
    );

    this.removeRefreshTokenCookie(res);

    return this.responseType.successResponse({
      message: 'User Logout Successfully',
      data: null,
    });
  }

  async refreshToken(req: Request, res: Response) {
    const refreshToken = req.cookies['refresh_token'];

    if (!refreshToken) {
      this.removeRefreshTokenCookie(res);
      throw new UnauthorizedException('Missing refresh token');
    }
    const refreshHash = hashToken(refreshToken);

    const findSession =
      await this.userSessionService.userSessionRepository.findOne({
        where: {
          refresh_token: refreshHash,
          is_revoked: false,
        },
      });

    if (!findSession) {
      this.removeRefreshTokenCookie(res);
      throw new UnauthorizedException('Invalid session');
    }

    if (isAfter(new Date(), findSession.expires_at)) {
      this.removeRefreshTokenCookie(res);
      findSession.is_revoked = true;
      findSession.revoked_at = getCurrentDateTime();
      await this.userSessionService.userSessionRepository.save(findSession);
      throw new UnauthorizedException('Session expired');
    }

    const user = await this.userService.findOne(findSession.user_id);
    if (!user.data) {
      this.removeRefreshTokenCookie(res);
      throw new UnauthorizedException('User not found for the session');
    }

    // * Generate New Access Token
    const tokenPayload: TokenCreationPayload = {
      user_id: user.data.user_id,
      role_id: user.data.role_id,
      user_name: user.data.user_name,
      role_code: user.data.role?.role_code ?? '',
      session_id: findSession.session_id,
    };
    const newAccessToken = await this.generateAccessToken(
      cloneDeep(tokenPayload),
    );

    // * Generate Refresh Token
    const newRefreshToken = generateRandomToken();

    // * Update User Session Table with New Refresh Token and Expiration Time
    findSession.refresh_token = hashToken(newRefreshToken);
    // findSession.expires_at = moment().add(30, 'day').toDate();
    await this.userSessionService.userSessionRepository.save(findSession);

    res.cookie('refresh_token', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/api/auth',
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    return this.responseType.successResponse({
      data: {
        access_token: newAccessToken.token,
        session_id: findSession.session_id,
        user_id: user.data.user_id,
      },
      message: 'Token Refreshed Successfully',
    });
  }

  async verifyToken(_: any, user: IUserSession) {
    try {
      const oldSession = await this.cacheManager.get(
        ApplicationSharedData.getSessionCacheKey(user.user_id),
      );

      if (!oldSession) {
        throw new UnauthorizedException('Cache Got Cleared, Logging Out User');
      }

      if (oldSession) {
        return this.responseType.successResponse({
          data: oldSession,
          message: 'User Session Found',
        });
      }

      const findUser = await this.userService.findOne(user.user_id);
      if (!findUser.data) {
        return this.responseType.errorResponse({
          message: 'User Not Found for the Token User Id Provided',
          data: null,
        });
      }
      const foundUser = findUser.data;

      const userRoleAndPermission =
        await this.userService.getUserRoleAndPermission(foundUser.role_id);

      // TODO: Send whole Found User Object inside the User Info
      const userData = {
        userInfo: {
          user_id: foundUser.user_id,
          email_id: foundUser.email_id,
          user_name: foundUser.user_name,
          created_date: foundUser.created_date,
        },
        role: userRoleAndPermission.role,
        pagePermissions: userRoleAndPermission.permissions,
      };
      return this.responseType.successResponse({
        data: userData,
        message: 'User Verified Successfully',
      });
    } catch (error) {
      return this.responseType.errorResponse({
        error,
        data: null,
        message: 'Session Expired',
      });
    }
  }

  async verifyEmail(payload: VerifyEmailDto) {
    const user = await this.userService.userRepository.findOne({
      where: {
        email_id: payload.email,
      },
    });

    if (!user) {
      return this.responseType.createResponse({
        data: null,
        message: 'User Not Found',
        status: '404',
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    return this.responseType.successResponse({
      data: user,
      message: 'User Found Successfully',
    });
  }

  async getCurrentUser(user: IUserSession) {
    try {
      const findUser = await this.userService.findOne(user.user_id);
      if (!findUser.data) {
        return this.responseType.errorResponse({
          message: 'User Not Found for the Token User Id Provided',
          data: null,
        });
      }

      return this.responseType.successResponse({
        message: 'User Found Successfully',
        data: findUser.data,
      });
    } catch (error) {
      return this.responseType.errorResponse({
        error,
        data: null,
        message: 'Error While Getting Current User',
      });
    }
  }

  async changePassword(data: ChangePasswordDto, user: IUserSession) {
    try {
      const userEntity = await this.userService.findOne(user.user_id);

      if (!userEntity.data) {
        return this.responseType.errorResponse({
          message: 'User Not Found',
          data: null,
        });
      }

      const decryptedData: ChangePasswordDto = {
        current_password: cryptoDecrypt(data.current_password),
        new_password: cryptoDecrypt(data.new_password),
        cnf_new_password: cryptoDecrypt(data.cnf_new_password),
      };

      const { cnf_new_password, current_password, new_password } =
        decryptedData;

      if (new_password !== cnf_new_password) {
        return this.responseType.errorResponse({
          message: 'New Password and Confirm Password not Matched',
          data: null,
        });
      }

      if (userEntity.data.user_password !== current_password) {
        return this.responseType.errorResponse({
          message: 'Password does not match',
          data: null,
        });
      }

      const updatedUser = await this.userService.update(
        {
          ...userEntity.data,
          last_password_changed_date: getCurrentDateTime(),
          user_password: new_password,
        },
        user,
      );

      return this.responseType.successResponse({
        message: 'Password Changed Successfully',
        data: updatedUser.data,
      });
    } catch (error) {
      return this.responseType.errorResponse({
        error,
        data: null,
        message: 'Failed to Change Password',
      });
    }
  }

  async changeTpin(data: ChangeTpinDto, user: IUserSession) {
    try {
      const userEntity = await this.userService.findOne(user.user_id);

      if (!userEntity.data) {
        return this.responseType.errorResponse({
          message: 'User Not Found',
          data: null,
        });
      }

      const decryptedData: ChangeTpinDto = {
        current_tpin: cryptoDecrypt(data.current_tpin),
        new_tpin: cryptoDecrypt(data.new_tpin),
        cnf_new_tpin: cryptoDecrypt(data.cnf_new_tpin),
      };

      const { current_tpin, new_tpin, cnf_new_tpin } = decryptedData;

      if (new_tpin !== cnf_new_tpin) {
        return this.responseType.errorResponse({
          message: 'New TPIN and Confirm TPIN not Matched',
          data: null,
        });
      }

      if (userEntity.data.user_tpin !== current_tpin) {
        return this.responseType.errorResponse({
          message: 'TPIN does not match',
          data: null,
        });
      }

      const updatedUser = await this.userService.update(
        {
          ...userEntity.data,
          user_tpin: new_tpin,
        },
        user,
      );

      return this.responseType.successResponse({
        message: 'TPIN Changed Successfully',
        data: updatedUser.data,
      });
    } catch (error) {
      return this.responseType.errorResponse({
        error,
        data: null,
        message: 'Failed to Change TPIN',
      });
    }
  }

  async registerUser(userRegisterDto: CreateUserDto) {
    const res = await this.userService.create(userRegisterDto);
    if (!res.data) {
      return this.responseType.errorResponse({
        data: null,
        message: 'Something went Wrong',
      });
    }

    const userRoleAndPermission =
      await this.userService.getUserRoleAndPermission(res.data.role_id);
    const userData = {
      user_info: {
        user_id: res.data.user_id,
        email_id: res.data.email_id,
        user_name: res.data.user_name,
        created_date: res.data.created_date,
        role_id: res.data.role_id,
      },
      role: userRoleAndPermission.role,
      page_permissions: userRoleAndPermission.permissions,
    };

    const token = await this.generateAccessToken({
      user_id: userData.user_info.user_id,
      role_id: userData.user_info.role_id,
      user_name: userData.user_info.user_name,
      role_code: '',
      session_id: '',
    });

    const { user_password, ...restUser } = res.data;
    return this.responseType.successResponse({
      data: {
        user: restUser,
        token: token.token,
      },
      message: 'User Created Successfully',
    });
  }
}
