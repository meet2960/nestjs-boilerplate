import { Test, TestingModule } from '@nestjs/testing';
import { LocalLogService } from './local-log.service';

describe('LocalLogService', () => {
  let service: LocalLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocalLogService],
    }).compile();

    service = module.get<LocalLogService>(LocalLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
