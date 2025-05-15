import { Body, Controller, Post } from '@nestjs/common';
import { TimeCalculatorService, TimeCalculationOptions } from './time-calculator.service';

class CalculateExitTimeDto {
  entryTime: string;
  options?: TimeCalculationOptions;
}

class CalculateLunchReturnTimeDto {
  entryTime: string;
  lunchTime: string;
  options?: TimeCalculationOptions;
}

class CalculateExitTimeWithLunchDto {
  entryTime: string;
  lunchTime: string;
  returnTime: string;
  options?: TimeCalculationOptions;
}

class CalculateExtraHoursDto {
  entryTime: string;
  lunchTime: string;
  returnTime: string;
  exitTime: string;
  returnToWorkTime: string;
  finalExitTime: string;
}

@Controller('time-calculator')
export class TimeCalculatorController {
  constructor(private readonly timeCalculatorService: TimeCalculatorService) {}

  @Post('exit-time')
  calculateExitTime(@Body() body: CalculateExitTimeDto) {
    return {
      result: this.timeCalculatorService.calculateExitTime(body.entryTime, body.options),
    };
  }

  @Post('lunch-return-time')
  calculateLunchReturnTime(@Body() body: CalculateLunchReturnTimeDto) {
    return {
      result: this.timeCalculatorService.calculateLunchReturnTime(
        body.entryTime,
        body.lunchTime,
        body.options
      ),
    };
  }

  @Post('exit-time-with-lunch')
  calculateExitTimeWithLunch(@Body() body: CalculateExitTimeWithLunchDto) {
    return {
      result: this.timeCalculatorService.calculateExitTimeWithLunch(
        body.entryTime,
        body.lunchTime,
        body.returnTime,
        body.options
      ),
    };
  }

  @Post('extra-hours')
  calculateExtraHours(@Body() body: CalculateExtraHoursDto) {
    return {
      result: this.timeCalculatorService.calculateExtraHours(
        body.entryTime,
        body.lunchTime,
        body.returnTime,
        body.exitTime,
        body.returnToWorkTime,
        body.finalExitTime,
      ),
    };
  }
}
