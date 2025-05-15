import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configuração do CORS para permitir acesso do frontend
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  });
  
  // Usando a porta 3001 para o backend para evitar conflito com o frontend (Next.js)
  await app.listen(process.env.PORT ?? 3001);
  
  console.log(`Aplicação rodando na porta ${process.env.PORT ?? 3001}`);
}
bootstrap();
