import { Test, TestingModule } from '@nestjs/testing';
import { VirtualCodeService } from './virtual-code.service';

describe('VirtualCodeService', () => {
  let service: VirtualCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VirtualCodeService],
    }).compile();

    service = module.get<VirtualCodeService>(VirtualCodeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
