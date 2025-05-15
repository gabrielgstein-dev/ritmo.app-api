import { Body, Controller, Post } from '@nestjs/common';
import { TimeCalculatorService } from './time-calculator.service';

class CalculateExitTimeDto {
  entryTime: string;
}

class CalculateLunchReturnTimeDto {
  entryTime: string;
  lunchTime: string;
}

class CalculateExitTimeWithLunchDto {
  entryTime: string;
  lunchTime: string;
  returnTime: string;
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
      result: this.timeCalculatorService.calculateExitTime(body.entryTime),
    };
  }

  @Post('lunch-return-time')
  calculateLunchReturnTime(@Body() body: CalculateLunchReturnTimeDto) {
    return {
      result: this.timeCalculatorService.calculateLunchReturnTime(
        body.entryTime,
        body.lunchTime,
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
