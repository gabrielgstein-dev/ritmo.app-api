import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  cnpj?: string;

  @IsOptional()
  @IsNumber()
  workHours?: number;

  @IsOptional()
  @IsNumber()
  lunchBreak?: number;
}
