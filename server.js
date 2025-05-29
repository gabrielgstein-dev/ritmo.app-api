// Arquivo server.js// Script para inicialização da aplicação no Render

// Definir parâmetros de conexão com o banco de dados se não estiverem definidos
if (!process.env.DB_HOST) {
  process.env.DB_HOST = 'dpg-d0reskumcj7s7387b6t0-a';
}

if (!process.env.DB_PORT) {
  process.env.DB_PORT = '5432';
}

if (!process.env.DB_USERNAME) {
  process.env.DB_USERNAME = 'ritmodb_user';
}

if (!process.env.DB_PASSWORD) {
  process.env.DB_PASSWORD = 'mO3C7prhkLyfshsO6Qt5vz26A9rK7iQp';
}

if (!process.env.DB_DATABASE) {
  process.env.DB_DATABASE = 'ritmodb';
}

// Carregar a aplicação NestJS compilada
const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('./dist/app.module');

async function bootstrap() {
  const port = process.env.PORT || 3000;
  
  try {
    const app = await NestFactory.create(AppModule);
    await app.listen(port, '0.0.0.0');
  } catch (error) {
    console.error('Erro ao iniciar a aplicação:', error);
    console.error(error);
    process.exit(1);
  }
}

// Iniciar o servidor
bootstrap();
