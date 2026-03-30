import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import type { IUserSession } from '@/common/entity/IUserSession';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ChangeTpinDto } from './dto/change-tpin.dto';
import { GenerateTokenDto } from './dto/generate-token.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import {
  AuthMethodDecorator,
  AuthUser,
  PermissionDecorator,
} from '../../decorators';
import { ActionCode } from '../helpers/casl/static/action-code';
import { PageCode } from '../helpers/casl/static/page-code';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login User' })
  async login(
    @Body() data: UserLoginDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const response = await this.authService.loginUser(data, req, res);
    res.status(response.statusCode).json(response);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh User Token' })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await this.authService.refreshToken(req, res);
    res.status(response.statusCode).json(response);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout User' })
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const response = await this.authService.logout({}, req, res);
    res.status(response.statusCode).json(response);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register User' })
  @HttpCode(HttpStatus.OK)
  async register(@Body() data: any, @Res() res: Response) {
    const response = await this.authService.registerUser(data);
    res.status(response.statusCode).json(response);
  }

  @Post('verify-token')
  @ApiOperation({ summary: 'Verify User Token' })
  @AuthMethodDecorator()
  async verifyToken(
    @Body() data: any,
    @AuthUser() user: IUserSession,
    @Res() res: Response,
  ) {
    const response = await this.authService.verifyToken(data, user);
    res.status(response.statusCode).json(response);
  }

  @Post('verify-email')
  @ApiOperation({ summary: 'Verify User Email' })
  async verifyEmail(@Body() data: VerifyEmailDto, @Res() res: Response) {
    const response = await this.authService.verifyEmail(data);
    res.status(response.statusCode).json(response);
  }

  @Post('change-password')
  @ApiOperation({ summary: 'Change User Password' })
  @PermissionDecorator({
    action: ActionCode.manage,
    subject: PageCode.change_password,
  })
  @AuthMethodDecorator()
  async changePassword(
    @Body() data: ChangePasswordDto,
    @AuthUser() user: IUserSession,
    @Res() res: Response,
  ) {
    const response = await this.authService.changePassword(data, user);
    res.status(response.statusCode).json(response);
  }

  @Post('change-tpin')
  @ApiOperation({ summary: 'Change User TPIN' })
  @PermissionDecorator({
    action: ActionCode.manage,
    subject: PageCode.change_tpin,
  })
  @AuthMethodDecorator()
  async changeTpin(
    @Body() data: ChangeTpinDto,
    @AuthUser() user: IUserSession,
    @Res() res: Response,
  ) {
    const response = await this.authService.changeTpin(data, user);
    res.status(response.statusCode).json(response);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get Current User' })
  @PermissionDecorator({
    action: ActionCode.me,
    subject: PageCode.users,
  })
  @AuthMethodDecorator()
  async getCurrentUser(@AuthUser() user: IUserSession, @Res() res: Response) {
    const response = await this.authService.getCurrentUser(user);
    res.status(response.statusCode).json(response);
  }

  @Post('generate-token')
  @ApiOperation({ summary: 'Generate JWT Token By Payload' })
  async generateToken(@Body() data: GenerateTokenDto, @Res() res: Response) {
    const response = await this.authService.generateToken(data, data.secretKey);
    res.status(response.statusCode).json(response);
  }
}
