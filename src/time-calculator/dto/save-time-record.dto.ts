import { IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SaveTimeRecordDto {
  @ApiProperty({ description: 'Data do registro de ponto', example: '2023-05-15' })
  @IsDateString()
  date: string;

  @ApiProperty({ description: 'Horário de entrada', example: '08:00' })
  @IsString()
  entryTime: string;

  @ApiProperty({ description: 'Horário de saída para almoço', example: '12:00' })
  @IsString()
  lunchTime: string;

  @ApiProperty({ description: 'Horário de retorno do almoço', example: '13:00' })
  @IsString()
  returnTime: string;

  @ApiProperty({ description: 'Horário de saída', example: '17:00' })
  @IsString()
  exitTime: string;

  @ApiProperty({ description: 'ID da empresa', example: 1 })
  @IsNumber()
  companyId: number;

  @ApiPropertyOptional({ description: 'Horário de retorno ao trabalho após expediente', example: '19:00' })
  @IsString()
  @IsOptional()
  returnToWorkTime?: string;

  @ApiPropertyOptional({ description: 'Horário final de saída', example: '21:00' })
  @IsString()
  @IsOptional()
  finalExitTime?: string;
}
