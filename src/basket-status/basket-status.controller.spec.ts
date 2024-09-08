import { Test, TestingModule } from '@nestjs/testing';
import { BasketStatusController } from './basket-status.controller';

describe('BasketStatusController', () => {
  let controller: BasketStatusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BasketStatusController],
    }).compile();

    controller = module.get<BasketStatusController>(BasketStatusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
