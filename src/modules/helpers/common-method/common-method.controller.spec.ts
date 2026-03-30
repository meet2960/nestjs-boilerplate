import { Test, TestingModule } from '@nestjs/testing';
import { CommonMethodController } from './common-method.controller';
import { CommonMethodService } from './common-method.service';

describe('CommonMethodController', () => {
  let controller: CommonMethodController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommonMethodController],
      providers: [CommonMethodService],
    }).compile();

    controller = module.get<CommonMethodController>(CommonMethodController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
