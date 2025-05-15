import { Test, TestingModule } from '@nestjs/testing';
import { TimeCalculatorService } from './time-calculator.service';

describe('TimeCalculatorService', () => {
  let service: TimeCalculatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TimeCalculatorService],
    }).compile();

    service = module.get<TimeCalculatorService>(TimeCalculatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
