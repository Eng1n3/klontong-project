import { Test, TestingModule } from '@nestjs/testing';
import { VirtualCodeController } from './virtual-code.controller';

describe('VirtualCodeController', () => {
  let controller: VirtualCodeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VirtualCodeController],
    }).compile();

    controller = module.get<VirtualCodeController>(VirtualCodeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
