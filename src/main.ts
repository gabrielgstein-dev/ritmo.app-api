import './polyfills';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { config } from 'dotenv';

const env = process.env.NODE_ENV || 'development';
const envFile = env === 'production' ? '.env' : `.env.${env}`;
config({ path: envFile });

async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(',')
      : [
        'http://localhost:3000',
        'https://ponto-frontend.onrender.com',
        'https://ritmo-app-web.vercel.app',
        'https://ritmo.click',
      ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('API de Cálculo de Tempo')
    .setDescription(
      'API para cálculo de horários de trabalho, almoço e horas extras',
    )
    .setVersion('1.0')
    .addTag('time-calculator', 'Endpoints para cálculo de tempo')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Garantir que a aplicação escute na porta fornecida pelo Render
  // No Render, é CRUCIAL usar a variável de ambiente PORT fornecida pelo Render
  const port = parseInt(process.env.PORT || '3001', 10);
  
  // Importante: No Render, precisamos escutar em 0.0.0.0 para aceitar conexões externas
  console.log(`Tentando iniciar o servidor na porta ${port} e host 0.0.0.0...`);
  await app.listen(port, '0.0.0.0');

  // Logs detalhados para ajudar na depuração
  console.log(`Aplicação rodando na porta ${port}`);
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`Porta: ${port}`);
  console.log(`Host: 0.0.0.0`);
  console.log(
    `Database URL: ${process.env.DATABASE_URL ? 'Configurada' : 'Não configurada'}`,
  );
  console.log(
    `Internal Database URL: ${process.env.INTERNAL_DATABASE_URL ? 'Configurada' : 'Não configurada'}`,
  );
  console.log(
    `Documentação Swagger disponível em: http://localhost:${port}/api/docs`,
  );
  
  // Importante: Registrar que a aplicação está pronta para receber conexões
  console.log('Servidor iniciado e pronto para receber conexões!');
}
bootstrap();
