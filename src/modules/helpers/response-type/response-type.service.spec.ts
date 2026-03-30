import { Test, TestingModule } from '@nestjs/testing';
import { ResponseTypeService } from './response-type.service';

describe('ResponseTypeService', () => {
  let service: ResponseTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResponseTypeService],
    }).compile();

    service = module.get<ResponseTypeService>(ResponseTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
