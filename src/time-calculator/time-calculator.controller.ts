import { Body, Controller, Post } from '@nestjs/common';
import { TimeCalculatorService } from './time-calculator.service';
import {
  CalculateExitTimeDto,
  CalculateLunchReturnTimeDto,
  CalculateExitTimeWithLunchDto,
  CalculateExtraHoursDto,
  TimeResultDto,
  ExtraHoursResultDto
} from './dto/time-calculator.dto';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('time-calculator')
@Controller('time-calculator')
export class TimeCalculatorController {
  constructor(private readonly timeCalculatorService: TimeCalculatorService) {}

  @ApiOperation({ summary: 'Calcular horário de saída' })
  @ApiBody({ type: CalculateExitTimeDto })
  @ApiResponse({ status: 200, description: 'Horário de saída calculado com sucesso', type: TimeResultDto })
  @Post('exit-time')
  calculateExitTime(@Body() body: CalculateExitTimeDto) {
    return {
      result: this.timeCalculatorService.calculateExitTime(body.entryTime, body.options),
    };
  }

  @ApiOperation({ summary: 'Calcular horário de retorno do almoço' })
  @ApiBody({ type: CalculateLunchReturnTimeDto })
  @ApiResponse({ status: 200, description: 'Horário de retorno do almoço calculado com sucesso', type: TimeResultDto })
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

  @ApiOperation({ summary: 'Calcular horário de saída considerando almoço' })
  @ApiBody({ type: CalculateExitTimeWithLunchDto })
  @ApiResponse({ status: 200, description: 'Horário de saída calculado com sucesso', type: TimeResultDto })
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

  @ApiOperation({ summary: 'Calcular horas extras' })
  @ApiBody({ type: CalculateExtraHoursDto })
  @ApiResponse({ status: 200, description: 'Horas extras calculadas com sucesso', type: ExtraHoursResultDto })
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
        body.options
      ),
    };
  }
}
