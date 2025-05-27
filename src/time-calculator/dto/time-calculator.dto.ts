import { TimeCalculationOptions } from '../time-calculator.service';
import { ApiProperty } from '@nestjs/swagger';

export class CalculateExitTimeDto {
  @ApiProperty({ description: 'Horário de entrada (formato HH:MM)', example: '08:00' })
  entryTime: string;

  @ApiProperty({ description: 'Opções de cálculo de tempo', required: false })
  options?: TimeCalculationOptions;
}

export class CalculateLunchReturnTimeDto {
  @ApiProperty({ description: 'Horário de entrada (formato HH:MM)', example: '08:00' })
  entryTime: string;

  @ApiProperty({ description: 'Horário de saída para almoço (formato HH:MM)', example: '12:00' })
  lunchTime: string;

  @ApiProperty({ description: 'Opções de cálculo de tempo', required: false })
  options?: TimeCalculationOptions;
}

export class CalculateExitTimeWithLunchDto {
  @ApiProperty({ description: 'Horário de entrada (formato HH:MM)', example: '08:00' })
  entryTime: string;

  @ApiProperty({ description: 'Horário de saída para almoço (formato HH:MM)', example: '12:00' })
  lunchTime: string;

  @ApiProperty({ description: 'Horário de retorno do almoço (formato HH:MM)', example: '13:00' })
  returnTime: string;

  @ApiProperty({ description: 'Opções de cálculo de tempo', required: false })
  options?: TimeCalculationOptions;
}

export class CalculateExtraHoursDto {
  @ApiProperty({ description: 'Horário de entrada (formato HH:MM)', example: '08:00' })
  entryTime: string;

  @ApiProperty({ description: 'Horário de saída para almoço (formato HH:MM)', example: '12:00' })
  lunchTime: string;

  @ApiProperty({ description: 'Horário de retorno do almoço (formato HH:MM)', example: '13:00' })
  returnTime: string;

  @ApiProperty({ description: 'Horário de saída (formato HH:MM)', example: '17:00' })
  exitTime: string;

  @ApiProperty({ description: 'Horário de retorno ao trabalho (formato HH:MM)', example: '19:00' })
  returnToWorkTime: string;

  @ApiProperty({ description: 'Horário de saída final (formato HH:MM)', example: '21:00' })
  finalExitTime: string;

  @ApiProperty({ description: 'Opções de cálculo de tempo', required: false })
  options?: TimeCalculationOptions;
}

export class TimeResultDto {
  @ApiProperty({ description: 'Horas calculadas', example: 17 })
  hours: number;

  @ApiProperty({ description: 'Minutos calculados', example: 30 })
  minutes: number;

  @ApiProperty({ description: 'Tempo formatado', example: '17:30' })
  formattedTime: string;
}

export class ExtraHoursResultDto {
  @ApiProperty({ description: 'Horas extras calculadas', example: 2 })
  extraHours: number;

  @ApiProperty({ description: 'Minutos extras calculados', example: 30 })
  extraMinutes: number;

  @ApiProperty({ description: 'Tempo formatado', example: '02:30' })
  formattedTime: string;

  @ApiProperty({ description: 'Indica se há horas extras (true) ou horas faltantes (false)', example: true })
  isExtra: boolean;
}

export class TimeCalculationOptionsDto {
  @ApiProperty({ description: 'Horas de trabalho padrão', example: 8, required: false })
  standardWorkHours?: number;

  @ApiProperty({ description: 'Tempo de almoço padrão em horas', example: 1, required: false })
  standardLunchBreak?: number;
}
