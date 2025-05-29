// Arquivo server.js específico para o Render
// Este arquivo é uma solução comum para problemas de detecção de porta no Render

console.log('=== INICIANDO SERVIDOR PARA O RENDER ===');
console.log(`Data e hora: ${new Date().toISOString()}`);
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`PORT: ${process.env.PORT}`);

// Definir explicitamente a URL interna do banco de dados se não estiver definida
if (!process.env.INTERNAL_DATABASE_URL) {
  process.env.INTERNAL_DATABASE_URL = 'postgresql://ritmodb_user:mO3C7prhkLyfshsO6Qt5vz26A9rK7iQp@dpg-d0reskumcj7s7387b6t0-a/ritmodb';
  console.log('URL interna do banco de dados definida manualmente');
}

// Verificar se a URL do banco de dados contém o domínio .oregon-postgres.render.com
if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('.oregon-postgres.render.com')) {
  const originalUrl = process.env.DATABASE_URL;
  process.env.DATABASE_URL = originalUrl.replace('.oregon-postgres.render.com', '');
  console.log(`URL do banco de dados convertida para formato interno`);
}

// Carregar a aplicação NestJS compilada
const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('./dist/app.module');

async function bootstrap() {
  try {
    // Garantir que a porta seja um número
    const port = parseInt(process.env.PORT || '3001', 10);
    
    console.log(`Tentando criar a aplicação NestJS...`);
    const app = await NestFactory.create(AppModule);
    
    // Configurar CORS
    app.enableCors({
      origin: process.env.CORS_ORIGIN
        ? process.env.CORS_ORIGIN.split(',')
        : ['*'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      credentials: true,
    });
    
    console.log(`Iniciando servidor na porta ${port} e host 0.0.0.0...`);
    
    // Iniciar o servidor - é CRUCIAL usar 0.0.0.0 como host no Render
    await app.listen(port, '0.0.0.0');
    
    console.log(`Servidor iniciado com sucesso na porta ${port}`);
    console.log(`Aplicação pronta para receber conexões!`);
  } catch (error) {
    console.error('Erro ao iniciar o servidor:');
    console.error(error);
    process.exit(1);
  }
}

// Iniciar o servidor
bootstrap();
