import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TimeCalculatorModule } from './time-calculator/time-calculator.module';

@Module({
  imports: [TimeCalculatorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
