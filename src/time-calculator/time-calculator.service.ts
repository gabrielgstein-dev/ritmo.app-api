import { Injectable } from '@nestjs/common';

export interface TimeResult {
  hours: number;
  minutes: number;
  formattedTime: string;
}

export interface ExtraHoursResult {
  extraHours: number;
  extraMinutes: number;
  formattedTime: string;
  isExtra: boolean;
}

export interface TimeCalculationOptions {
  standardWorkHours?: number;
  standardLunchBreak?: number;
}

@Injectable()
export class TimeCalculatorService {
  private readonly WORK_HOURS = 8; // Jornada de trabalho padrão (8 horas)
  private readonly LUNCH_BREAK = 1; // Intervalo de almoço padrão (1 hora)
  
  private getWorkHours(options?: TimeCalculationOptions): number {
    return options?.standardWorkHours || this.WORK_HOURS;
  }
  
  private getLunchBreak(options?: TimeCalculationOptions): number {
    return options?.standardLunchBreak || this.LUNCH_BREAK;
  }

  calculateExitTime(entryTime: string, options?: TimeCalculationOptions): TimeResult {
    const [hours, minutes] = entryTime.split(':').map(Number);
    const entryDate = new Date();
    entryDate.setHours(hours, minutes, 0, 0);

    const exitDate = new Date(entryDate);
    exitDate.setHours(exitDate.getHours() + this.getWorkHours(options));

    return this.formatTimeResult(exitDate.getHours(), exitDate.getMinutes());
  }

  calculateLunchReturnTime(entryTime: string, lunchTime: string, options?: TimeCalculationOptions): TimeResult {
    const [lunchHours, lunchMinutes] = lunchTime.split(':').map(Number);
    const lunchDate = new Date();
    lunchDate.setHours(lunchHours, lunchMinutes, 0, 0);

    const returnDate = new Date(lunchDate);
    returnDate.setHours(returnDate.getHours() + this.getLunchBreak(options));

    return this.formatTimeResult(returnDate.getHours(), returnDate.getMinutes());
  }

  calculateExitTimeWithLunch(
    entryTime: string,
    lunchTime: string,
    returnTime: string,
    options?: TimeCalculationOptions
  ): TimeResult {
    const [entryHours, entryMinutes] = entryTime.split(':').map(Number);
    const [lunchHours, lunchMinutes] = lunchTime.split(':').map(Number);
    const [returnHours, returnMinutes] = returnTime.split(':').map(Number);

    // Converter para minutos para facilitar o cálculo
    const entryMinutesTotal = entryHours * 60 + entryMinutes;
    const lunchMinutesTotal = lunchHours * 60 + lunchMinutes;
    const returnMinutesTotal = returnHours * 60 + returnMinutes;

    // Calcular o tempo trabalhado antes do almoço
    const beforeLunchMinutes = lunchMinutesTotal - entryMinutesTotal;

    // Calcular o tempo restante para completar a jornada
    const remainingMinutes = this.getWorkHours(options) * 60 - beforeLunchMinutes;

    // Calcular o horário de saída
    const exitMinutesTotal = returnMinutesTotal + remainingMinutes;

    // Converter de volta para horas e minutos
    const exitHours = Math.floor(exitMinutesTotal / 60);
    const exitMinutes = exitMinutesTotal % 60;

    return this.formatTimeResult(exitHours, exitMinutes);
  }

  calculateExtraHours(
    entryTime: string,
    lunchTime: string,
    returnTime: string,
    exitTime: string,
    returnToWorkTime: string,
    finalExitTime: string,
  ): ExtraHoursResult {
    // Converter todos os horários para minutos
    const entryMinutes = this.timeToMinutes(entryTime);
    const lunchMinutes = this.timeToMinutes(lunchTime);
    const returnFromLunchMinutes = this.timeToMinutes(returnTime);
    const exitMinutes = this.timeToMinutes(exitTime);
    const returnToWorkMinutes = this.timeToMinutes(returnToWorkTime);
    const finalExitMinutes = this.timeToMinutes(finalExitTime);

    // Calcular tempo total trabalhado na jornada normal
    const beforeLunchMinutes = lunchMinutes - entryMinutes;
    const afterLunchMinutes = exitMinutes - returnFromLunchMinutes;
    const regularWorkMinutes = beforeLunchMinutes + afterLunchMinutes;

    // Calcular tempo trabalhado após retorno
    const extraWorkMinutes = finalExitMinutes - returnToWorkMinutes;

    // Calcular diferença entre jornada padrão e jornada realizada
    const standardWorkMinutes = this.WORK_HOURS * 60;
    const totalWorkMinutes = regularWorkMinutes + extraWorkMinutes;
    const diffMinutes = totalWorkMinutes - standardWorkMinutes;

    // Determinar se houve hora extra ou faltante
    const isExtra = diffMinutes > 0;
    const absDiffMinutes = Math.abs(diffMinutes);
    const diffHours = Math.floor(absDiffMinutes / 60);
    const diffRemainingMinutes = absDiffMinutes % 60;

    return {
      extraHours: diffHours,
      extraMinutes: diffRemainingMinutes,
      formattedTime: `${String(diffHours).padStart(2, '0')}:${String(
        diffRemainingMinutes,
      ).padStart(2, '0')}`,
      isExtra,
    };
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private formatTimeResult(hours: number, minutes: number): TimeResult {
    // Ajustar para formato 24h se necessário
    const adjustedHours = hours >= 24 ? hours - 24 : hours;
    
    return {
      hours: adjustedHours,
      minutes,
      formattedTime: `${String(adjustedHours).padStart(2, '0')}:${String(
        minutes,
      ).padStart(2, '0')}`,
    };
  }
}
