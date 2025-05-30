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

  // Configuração de CORS melhorada para funcionar em todos os ambientes
  const corsOrigin = process.env.CORS_ORIGIN;
  
  // Configuração de CORS baseada no ambiente
  if (corsOrigin === '*') {
    // Se CORS_ORIGIN for *, permitir todas as origens
    app.enableCors({
      origin: true, // Isso permite qualquer origem
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      exposedHeaders: ['Content-Disposition']
    });
    console.log('CORS configurado para permitir todas as origens');
  } else {
    // Caso contrário, usar a lista de origens permitidas
    const allowedOrigins = corsOrigin
      ? corsOrigin.split(',')
      : [
          'http://localhost:3000',
          'http://localhost:5173',
          'http://localhost:5174',
          'http://localhost:8080',
          'https://ponto-frontend.onrender.com',
          'https://ritmo-app-web.vercel.app',
          'https://ritmo.click',
          'https://ritmo-app.vercel.app',
          // Permitir qualquer subdomínio de vercel.app
          /\.vercel\.app$/,
          // Permitir qualquer subdomínio de netlify.app
          /\.netlify\.app$/
        ];
    
    app.enableCors({
      origin: allowedOrigins,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      exposedHeaders: ['Content-Disposition']
    });
    console.log(`CORS configurado com origens específicas: ${JSON.stringify(allowedOrigins)}`);
  }
  

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
