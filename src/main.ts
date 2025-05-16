import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuração do CORS para permitir acesso do frontend
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  });

  // Porta definida pelo ambiente ou padrão 3001
  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`Aplicação rodando na porta ${port}`);
}
bootstrap();
