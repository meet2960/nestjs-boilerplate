import { Injectable } from '@nestjs/common';
import { PrismadbService } from './modules/helpers/prismadb/prismadb.service';

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
}
