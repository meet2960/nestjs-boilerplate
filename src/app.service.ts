import { Injectable } from '@nestjs/common';
import { PrismadbService } from './modules/helpers/prismadb/prismadb.service';
import { getCurrentUtcDateTime } from './common/utility/date-fns-utils';
import { getRandomNumber } from './common/utility/generator-utils';
import { CreateUserDto } from './create-user.dto';

@Injectable()
export class AppService {
  constructor(private prisma: PrismadbService) {}
  getHello(): string {
    return 'Hello World!!';
  }

  async getAllUsers() {
    const res = await this.prisma.roles.findMany({
      select: {
        role_id: true,
        role_name: true,
      },
    });
    return res;
  }

  async createUser(data: CreateUserDto) {
    try {
      const res = await this.prisma.users.create({
        data: {
          first_name: data.name,
          last_name: 'Shah',
          email_id: `${data.email}-${getRandomNumber()}`,
          created_date: getCurrentUtcDateTime(),
          is_active: true,
          mobile_no: '9725582557',
          role_id: 1,
          user_code: `U-${getRandomNumber()}`,
          user_name: 'meet shah',
          user_password: 'meet@123',
        },
      });
      console.log('User created:', res);
      return res;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  }
}
