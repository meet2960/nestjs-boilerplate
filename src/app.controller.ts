import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
// import { ZodValidationPipe } from 'nestjs-zod';
import { AppService } from './app.service';
import { CreateUserDto } from './create-user.dto';

@Controller()
// @UsePipes(ZodValidationPipe)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('users')
  getAllUsers() {
    return this.appService.getAllUsers();
  }

  @Post('create-user')
  async createUser(@Body() data: CreateUserDto, @Res() res: Response) {
    console.log('Data received in controller:', data);
    const response = await this.appService.createUser(data);
    res
      .status(200)
      .json({ message: 'User creation in progress', data: response });
  }
}
