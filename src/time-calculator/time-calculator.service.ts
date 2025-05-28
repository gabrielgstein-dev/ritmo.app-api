import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../companies/entities/company.entity';
import { User } from '../users/entities/user.entity';
import { TimeRecord } from '../time-records/entities/time-record.entity';

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
  companyId?: number;
}

@Injectable()
export class TimeCalculatorService {
  private readonly WORK_HOURS = 8;
  private readonly LUNCH_BREAK = 1;
  
  constructor(
    @InjectRepository(Company)
    private companiesRepository: Repository<Company>,
    @InjectRepository(TimeRecord)
    private timeRecordsRepository: Repository<TimeRecord>,
  ) {}
  
  private async getCompanySettings(options?: TimeCalculationOptions, user?: User): Promise<{ workHours: number; lunchBreak: number }> {

    if (!options?.companyId) {
      return {
        workHours: options?.standardWorkHours || this.WORK_HOURS,
        lunchBreak: options?.standardLunchBreak || this.LUNCH_BREAK,
      };
    }


    const company = await this.companiesRepository.findOne({
      where: { id: options.companyId },
      relations: ['users'],
    });

    if (!company) {
      return {
        workHours: options?.standardWorkHours || this.WORK_HOURS,
        lunchBreak: options?.standardLunchBreak || this.LUNCH_BREAK,
      };
    }


    if (user) {
      const hasAccess = company.users.some(companyUser => companyUser.id === user.id);
      if (!hasAccess) {
        throw new ForbiddenException('Você não tem acesso a esta empresa');
      }
    }

    return {
      workHours: company.workHours,
      lunchBreak: company.lunchBreak,
    };
  }
  
  private getWorkHours(options?: TimeCalculationOptions): number {
    return options?.standardWorkHours || this.WORK_HOURS;
  }
  
  private getLunchBreak(options?: TimeCalculationOptions): number {
    return options?.standardLunchBreak || this.LUNCH_BREAK;
  }

  async calculateExitTime(entryTime: string, options?: TimeCalculationOptions, user?: User): Promise<TimeResult> {

    let workHours = this.WORK_HOURS;
    if (options?.companyId && user) {
      const settings = await this.getCompanySettings(options, user);
      workHours = settings.workHours;
    } else {
      workHours = this.getWorkHours(options);
    }
    const [hours, minutes] = entryTime.split(':').map(Number);
    const entryDate = new Date();
    entryDate.setHours(hours, minutes, 0, 0);

    const exitDate = new Date(entryDate);
    exitDate.setHours(exitDate.getHours() + workHours);

    return this.formatTimeResult(exitDate.getHours(), exitDate.getMinutes());
  }

  async calculateLunchReturnTime(entryTime: string, lunchTime: string, options?: TimeCalculationOptions, user?: User): Promise<TimeResult> {

    let lunchBreak = this.LUNCH_BREAK;
    if (options?.companyId && user) {
      const settings = await this.getCompanySettings(options, user);
      lunchBreak = settings.lunchBreak;
    } else {
      lunchBreak = this.getLunchBreak(options);
    }
    const [lunchHours, lunchMinutes] = lunchTime.split(':').map(Number);
    const lunchDate = new Date();
    lunchDate.setHours(lunchHours, lunchMinutes, 0, 0);

    const returnDate = new Date(lunchDate);
    returnDate.setHours(returnDate.getHours() + lunchBreak);

    return this.formatTimeResult(returnDate.getHours(), returnDate.getMinutes());
  }

  async calculateExitTimeWithLunch(
    entryTime: string,
    lunchTime: string,
    returnTime: string,
    options?: TimeCalculationOptions,
    user?: User
  ): Promise<TimeResult> {

    let workHours = this.WORK_HOURS;
    if (options?.companyId && user) {
      const settings = await this.getCompanySettings(options, user);
      workHours = settings.workHours;
    } else {
      workHours = this.getWorkHours(options);
    }
    const [entryHours, entryMinutes] = entryTime.split(':').map(Number);
    const [lunchHours, lunchMinutes] = lunchTime.split(':').map(Number);
    const [returnHours, returnMinutes] = returnTime.split(':').map(Number);


    const entryMinutesTotal = entryHours * 60 + entryMinutes;
    const lunchMinutesTotal = lunchHours * 60 + lunchMinutes;
    const returnMinutesTotal = returnHours * 60 + returnMinutes;


    const beforeLunchMinutes = lunchMinutesTotal - entryMinutesTotal;


    const remainingMinutes = workHours * 60 - beforeLunchMinutes;


    const exitMinutesTotal = returnMinutesTotal + remainingMinutes;


    const exitHours = Math.floor(exitMinutesTotal / 60);
    const exitMinutes = exitMinutesTotal % 60;

    return this.formatTimeResult(exitHours, exitMinutes);
  }

  async calculateExtraHours(
    entryTime: string,
    lunchTime: string,
    returnTime: string,
    exitTime: string,
    returnToWorkTime: string,
    finalExitTime: string,
    options?: TimeCalculationOptions,
    user?: User
  ): Promise<ExtraHoursResult> {

    let workHours = this.WORK_HOURS;
    if (options?.companyId && user) {
      const settings = await this.getCompanySettings(options, user);
      workHours = settings.workHours;
    } else {
      workHours = this.getWorkHours(options);
    }

    const entryMinutes = this.timeToMinutes(entryTime);
    const lunchMinutes = this.timeToMinutes(lunchTime);
    const returnFromLunchMinutes = this.timeToMinutes(returnTime);
    const exitMinutes = this.timeToMinutes(exitTime);
    const returnToWorkMinutes = this.timeToMinutes(returnToWorkTime);
    const finalExitMinutes = this.timeToMinutes(finalExitTime);


    const beforeLunchMinutes = lunchMinutes - entryMinutes;
    const afterLunchMinutes = exitMinutes - returnFromLunchMinutes;
    const regularWorkMinutes = beforeLunchMinutes + afterLunchMinutes;


    const extraWorkMinutes = finalExitMinutes - returnToWorkMinutes;


    const standardWorkMinutes = workHours * 60;
    const totalWorkMinutes = regularWorkMinutes + extraWorkMinutes;
    const diffMinutes = totalWorkMinutes - standardWorkMinutes;


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

    const adjustedHours = hours >= 24 ? hours - 24 : hours;
    
    return {
      hours: adjustedHours,
      minutes,
      formattedTime: `${String(adjustedHours).padStart(2, '0')}:${String(
        minutes,
      ).padStart(2, '0')}`,
    };
  }

  async saveTimeRecord(
    user: User,
    date: string,
    entryTime: string,
    lunchTime: string,
    returnTime: string,
    exitTime: string,
    companyId: number,
    returnToWorkTime?: string,
    finalExitTime?: string,
  ): Promise<TimeRecord> {

    const company = await this.companiesRepository.findOne({
      where: { id: companyId },
      relations: ['users'],
    });

    if (!company) {
      throw new NotFoundException(`Empresa com ID ${companyId} não encontrada`);
    }

    const hasAccess = company.users.some(companyUser => companyUser.id === user.id);
    if (!hasAccess) {
      throw new ForbiddenException('Você não tem acesso a esta empresa');
    }


    const timeRecord = this.timeRecordsRepository.create({
      date: new Date(date),
      entryTime,
      lunchTime,
      returnTime,
      exitTime,
      returnToWorkTime,
      finalExitTime,
      userId: user.id,
      user,
      companyId,
      company,
    });

    return this.timeRecordsRepository.save(timeRecord);
  }
}
