import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuração do CORS para permitir acesso do frontend
  app.enableCors({
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(',')
      : [
          'http://localhost:3000',
          'https://ponto-frontend.onrender.com',
          'https://ritmo-app-web.vercel.app',
        ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  // Configuração do Swagger
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

  // Porta definida pelo ambiente ou padrão 3001
  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`Aplicação rodando na porta ${port}`);
  console.log(
    `Documentação Swagger disponível em: http://localhost:${port}/api/docs`,
  );
}
bootstrap();
