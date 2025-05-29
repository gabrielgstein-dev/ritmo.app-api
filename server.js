// Arquivo server.js específico para o Render
// Este arquivo é uma solução comum para problemas de detecção de porta no Render

console.log('=== INICIANDO SERVIDOR PARA O RENDER ===');
console.log(`Data e hora: ${new Date().toISOString()}`);
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`PORT: ${process.env.PORT}`);

// Definir explicitamente os parâmetros de conexão com o banco de dados se não estiverem definidos
if (!process.env.DB_HOST) {
  process.env.DB_HOST = 'dpg-d0reskumcj7s7387b6t0-a';
  console.log('Host do banco de dados definido manualmente');
}

if (!process.env.DB_PORT) {
  process.env.DB_PORT = '5432';
  console.log('Porta do banco de dados definida manualmente');
}

if (!process.env.DB_USERNAME) {
  process.env.DB_USERNAME = 'ritmodb_user';
  console.log('Usuário do banco de dados definido manualmente');
}

if (!process.env.DB_PASSWORD) {
  process.env.DB_PASSWORD = 'mO3C7prhkLyfshsO6Qt5vz26A9rK7iQp';
  console.log('Senha do banco de dados definida manualmente');
}

if (!process.env.DB_DATABASE) {
  process.env.DB_DATABASE = 'ritmodb';
  console.log('Nome do banco de dados definido manualmente');
}

// Exibir informações de conexão com o banco de dados
console.log('=== Informações de conexão com o banco de dados ===');
console.log(`Host: ${process.env.DB_HOST}`);
console.log(`Port: ${process.env.DB_PORT}`);
console.log(`Database: ${process.env.DB_DATABASE}`);
console.log(`Username: ${process.env.DB_USERNAME}`);


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
