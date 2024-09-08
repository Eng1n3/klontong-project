import { Test, TestingModule } from '@nestjs/testing';
import { BasketStatusService } from './basket-status.service';

describe('BasketStatusService', () => {
  let service: BasketStatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BasketStatusService],
    }).compile();

    service = module.get<BasketStatusService>(BasketStatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
