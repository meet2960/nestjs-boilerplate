import { Test, TestingModule } from '@nestjs/testing';
import { LocalLogController } from './local-log.controller';
import { LocalLogService } from './local-log.service';

describe('LocalLogController', () => {
  let controller: LocalLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocalLogController],
      providers: [LocalLogService],
    }).compile();

    controller = module.get<LocalLogController>(LocalLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
