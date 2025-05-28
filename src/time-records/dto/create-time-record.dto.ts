import { IsString, IsDateString, IsNumber } from 'class-validator';

export class CreateTimeRecordDto {
  @IsDateString()
  date: string;

  @IsString()
  entryTime: string;

  @IsString()
  lunchTime: string;

  @IsString()
  returnTime: string;

  @IsString()
  exitTime: string;

  @IsString()
  returnToWorkTime?: string;

  @IsString()
  finalExitTime?: string;

  @IsNumber()
  companyId: number;
}
