import { Test, TestingModule } from '@nestjs/testing';
import { PrismadbController } from './prismadb.controller';
import { PrismadbService } from './prismadb.service';

describe('PrismadbController', () => {
  let controller: PrismadbController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrismadbController],
      providers: [PrismadbService],
    }).compile();

    controller = module.get<PrismadbController>(PrismadbController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
