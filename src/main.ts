import './polyfills';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  // Mostrar todas as variáveis de ambiente no início da aplicação
  console.log('=== VARIÁVEIS DE AMBIENTE ===');
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`PORT: ${process.env.PORT}`);
  console.log(
    `DATABASE_URL: ${process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 25) + '...' : 'Não definida'}`,
  );
  console.log(
    `INTERNAL_DATABASE_URL: ${process.env.INTERNAL_DATABASE_URL ? process.env.INTERNAL_DATABASE_URL.substring(0, 25) + '...' : 'Não definida'}`,
  );
  console.log(`DB_SYNCHRONIZE: ${process.env.DB_SYNCHRONIZE}`);
  console.log(`DB_MIGRATIONS_RUN: ${process.env.DB_MIGRATIONS_RUN}`);
  console.log(`DB_SSL: ${process.env.DB_SSL}`);
  console.log(
    `JWT_SECRET: ${process.env.JWT_SECRET ? '[DEFINIDO]' : 'Não definido'}`,
  );
  console.log(`JWT_EXPIRATION: ${process.env.JWT_EXPIRATION}`);
  console.log(`CORS_ORIGIN: ${process.env.CORS_ORIGIN}`);
  console.log('============================');

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
  const port = process.env.PORT || 3001;
  // Importante: No Render, precisamos escutar em 0.0.0.0 para aceitar conexões externas
  await app.listen(port, '0.0.0.0');

  console.log(`Aplicação rodando na porta ${port}`);
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(
    `Database URL: ${process.env.DATABASE_URL ? 'Configurada' : 'Não configurada'}`,
  );
  console.log(
    `Internal Database URL: ${process.env.INTERNAL_DATABASE_URL ? 'Configurada' : 'Não configurada'}`,
  );
  console.log(
    `Documentação Swagger disponível em: http://localhost:${port}/api/docs`,
  );
}
bootstrap();
