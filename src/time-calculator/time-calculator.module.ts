import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeCalculatorService } from './time-calculator.service';
import { TimeCalculatorController } from './time-calculator.controller';
import { Company } from '../companies/entities/company.entity';
import { TimeRecord } from '../time-records/entities/time-record.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Company, TimeRecord])],
  providers: [TimeCalculatorService],
  controllers: [TimeCalculatorController],
  exports: [TimeCalculatorService]
})
export class TimeCalculatorModule {}
