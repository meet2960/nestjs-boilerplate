import { Injectable } from '@nestjs/common';
import { I18nService } from './modules/helpers/i18n/i18n.service';
import { PrismadbService } from './modules/helpers/prismadb/prismadb.service';
import { getCurrentUtcDateTime } from './common/utility/date-fns.util';
import { getRandomNumber } from './common/utility/generator.util';
import { CreateUserDto } from './create-user.dto';

@Injectable()
export class AppService {
  constructor(
    private readonly prisma: PrismadbService,
    private readonly i18n: I18nService,
  ) {}
  async getHello(): Promise<{ data: null; message: string }> {
    const translatedMessage = await this.i18n.translate('hello_world');
    return { data: null, message: translatedMessage };
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
      const translatedMessage = await this.i18n.translate('user.created');
      return { data: res, message: translatedMessage };
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  }
}
