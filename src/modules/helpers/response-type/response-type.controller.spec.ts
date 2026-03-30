import { Test, TestingModule } from '@nestjs/testing';
import { ResponseTypeController } from './response-type.controller';
import { ResponseTypeService } from './response-type.service';

describe('ResponseTypeController', () => {
  let controller: ResponseTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResponseTypeController],
      providers: [ResponseTypeService],
    }).compile();

    controller = module.get<ResponseTypeController>(ResponseTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
