import { Test, TestingModule } from '@nestjs/testing';
import { TimeCalculatorController } from './time-calculator.controller';

describe('TimeCalculatorController', () => {
  let controller: TimeCalculatorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TimeCalculatorController],
    }).compile();

    controller = module.get<TimeCalculatorController>(TimeCalculatorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
