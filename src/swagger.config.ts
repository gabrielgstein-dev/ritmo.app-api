import { DocumentBuilder } from './swagger-types';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('API de Cálculo de Tempo')
  .setDescription('API para cálculo de horários de trabalho, almoço e horas extras')
  .setVersion('1.0')
  .addTag('time-calculator', 'Endpoints para cálculo de tempo')
  .build();
