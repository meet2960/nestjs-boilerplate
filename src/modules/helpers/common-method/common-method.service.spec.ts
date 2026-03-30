import { Test, TestingModule } from '@nestjs/testing';
import { CommonMethodService } from './common-method.service';

describe('CommonMethodService', () => {
  let service: CommonMethodService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommonMethodService],
    }).compile();

    service = module.get<CommonMethodService>(CommonMethodService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
