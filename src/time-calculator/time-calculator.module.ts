import { Module } from '@nestjs/common';
import { TimeCalculatorService } from './time-calculator.service';
import { TimeCalculatorController } from './time-calculator.controller';

@Module({
  providers: [TimeCalculatorService],
  controllers: [TimeCalculatorController]
})
export class TimeCalculatorModule {}
