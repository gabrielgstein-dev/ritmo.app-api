// Script para configurar as variáveis de ambiente no Render
const fs = require('fs');
const path = require('path');

console.log('=== Configurando variáveis de ambiente para o Render ===');

// Criar o arquivo .env.qa com as variáveis de ambiente do Render
const envContent = `
NODE_ENV=qa
PORT=${process.env.PORT || 10000}

# Configurações do Banco de Dados PostgreSQL
DATABASE_URL=${process.env.DATABASE_URL || ''}
INTERNAL_DATABASE_URL=${process.env.INTERNAL_DATABASE_URL || ''}

# Configurações de Migrations e Sincronização
DB_SYNCHRONIZE=${process.env.DB_SYNCHRONIZE || 'true'}
DB_MIGRATIONS_RUN=${process.env.DB_MIGRATIONS_RUN || 'true'}
DB_SSL=${process.env.DB_SSL || 'true'}

# Configurações da Aplicação
JWT_SECRET=${process.env.JWT_SECRET || 'R!Tm0@9505'}
JWT_EXPIRATION=${process.env.JWT_EXPIRATION || '1d'}

# Configurações de CORS
CORS_ORIGIN=${process.env.CORS_ORIGIN || '*'}
`;

// Escrever o arquivo .env.qa
fs.writeFileSync(path.join(__dirname, '.env.qa'), envContent.trim());
console.log('Arquivo .env.qa criado com sucesso!');

// Mostrar as variáveis de ambiente que foram configuradas (sem mostrar valores sensíveis)
console.log('\nVariáveis de ambiente configuradas:');
console.log(`NODE_ENV: qa`);
console.log(`PORT: ${process.env.PORT || 10000}`);
console.log(`DATABASE_URL: ${process.env.DATABASE_URL ? '[CONFIGURADO]' : 'Não configurado'}`);
console.log(`INTERNAL_DATABASE_URL: ${process.env.INTERNAL_DATABASE_URL ? '[CONFIGURADO]' : 'Não configurado'}`);
console.log(`DB_SYNCHRONIZE: ${process.env.DB_SYNCHRONIZE || 'true'}`);
console.log(`DB_MIGRATIONS_RUN: ${process.env.DB_MIGRATIONS_RUN || 'true'}`);
console.log(`DB_SSL: ${process.env.DB_SSL || 'true'}`);
console.log(`JWT_SECRET: ${process.env.JWT_SECRET ? '[CONFIGURADO]' : 'Não configurado'}`);
console.log(`JWT_EXPIRATION: ${process.env.JWT_EXPIRATION || '1d'}`);
console.log(`CORS_ORIGIN: ${process.env.CORS_ORIGIN || '*'}`);

console.log('\n=== Configuração de variáveis de ambiente concluída ===');
