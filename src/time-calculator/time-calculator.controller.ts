import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { TimeCalculatorService } from './time-calculator.service';
import {
  CalculateExitTimeDto,
  CalculateLunchReturnTimeDto,
  CalculateExitTimeWithLunchDto,
  CalculateExtraHoursDto,
  TimeResultDto,
  ExtraHoursResultDto
} from './dto/time-calculator.dto';
import { SaveTimeRecordDto } from './dto/save-time-record.dto';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('time-calculator')
@Controller('time-calculator')
export class TimeCalculatorController {
  constructor(private readonly timeCalculatorService: TimeCalculatorService) {}

  @ApiOperation({ summary: 'Calcular horário de saída' })
  @ApiBody({ type: CalculateExitTimeDto })
  @ApiResponse({ status: 200, description: 'Horário de saída calculado com sucesso', type: TimeResultDto })
  @Post('exit-time')
  async calculateExitTime(
    @Body() body: CalculateExitTimeDto,
    @GetUser() user?: User
  ) {
    return {
      result: await this.timeCalculatorService.calculateExitTime(body.entryTime, body.options, user),
    };
  }

  @ApiOperation({ summary: 'Calcular horário de retorno do almoço' })
  @ApiBody({ type: CalculateLunchReturnTimeDto })
  @ApiResponse({ status: 200, description: 'Horário de retorno do almoço calculado com sucesso', type: TimeResultDto })
  @Post('lunch-return-time')
  async calculateLunchReturnTime(
    @Body() body: CalculateLunchReturnTimeDto,
    @GetUser() user?: User
  ) {
    return {
      result: await this.timeCalculatorService.calculateLunchReturnTime(
        body.entryTime,
        body.lunchTime,
        body.options,
        user
      ),
    };
  }

  @ApiOperation({ summary: 'Calcular horário de saída considerando almoço' })
  @ApiBody({ type: CalculateExitTimeWithLunchDto })
  @ApiResponse({ status: 200, description: 'Horário de saída calculado com sucesso', type: TimeResultDto })
  @Post('exit-time-with-lunch')
  async calculateExitTimeWithLunch(
    @Body() body: CalculateExitTimeWithLunchDto,
    @GetUser() user?: User
  ) {
    return {
      result: await this.timeCalculatorService.calculateExitTimeWithLunch(
        body.entryTime,
        body.lunchTime,
        body.returnTime,
        body.options,
        user
      ),
    };
  }

  @ApiOperation({ summary: 'Calcular horas extras' })
  @ApiBody({ type: CalculateExtraHoursDto })
  @ApiResponse({ status: 200, description: 'Horas extras calculadas com sucesso', type: ExtraHoursResultDto })
  @Post('extra-hours')
  async calculateExtraHours(
    @Body() body: CalculateExtraHoursDto,
    @GetUser() user?: User
  ) {
    return {
      result: await this.timeCalculatorService.calculateExtraHours(
        body.entryTime,
        body.lunchTime,
        body.returnTime,
        body.exitTime,
        body.returnToWorkTime,
        body.finalExitTime,
        body.options,
        user
      ),
    };
  }

  @ApiOperation({ summary: 'Salvar registro de ponto' })
  @ApiBody({ type: SaveTimeRecordDto })
  @ApiResponse({ status: 201, description: 'Registro de ponto salvo com sucesso' })
  @UseGuards(JwtAuthGuard)
  @Post('save-time-record')
  async saveTimeRecord(
    @Body() body: SaveTimeRecordDto,
    @GetUser() user: User
  ) {
    return {
      result: await this.timeCalculatorService.saveTimeRecord(
        user,
        body.date,
        body.entryTime,
        body.lunchTime,
        body.returnTime,
        body.exitTime,
        body.companyId,
        body.returnToWorkTime,
        body.finalExitTime
      ),
    };
  }
}
