import { Test, TestingModule } from '@nestjs/testing';
import { EmailSenderController } from './email-sender.controller';
import { EmailSenderService } from './email-sender.service';

describe('EmailSenderController', () => {
  let controller: EmailSenderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmailSenderController],
      providers: [EmailSenderService],
    }).compile();

    controller = module.get<EmailSenderController>(EmailSenderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
