// Script para verificar as variáveis de ambiente antes do deploy
console.log('=== PRÉ-DEPLOY: VERIFICAÇÃO DE VARIÁVEIS DE AMBIENTE ===');
console.log('Data e hora atual:', new Date().toISOString());
console.log('\nVariáveis de ambiente disponíveis:');

// Lista de variáveis de ambiente importantes para verificar
const importantVars = [
  'NODE_ENV',
  'PORT',
  'DATABASE_URL',
  'INTERNAL_DATABASE_URL',
  'DB_SYNCHRONIZE',
  'DB_MIGRATIONS_RUN',
  'DB_SSL',
  'JWT_SECRET',
  'JWT_EXPIRATION',
  'CORS_ORIGIN',
];

// Verificar cada variável de ambiente importante
importantVars.forEach(varName => {
  const value = process.env[varName];
  if (varName.includes('DATABASE_URL') && value) {
    // Mostrar apenas parte da URL do banco de dados por segurança
    console.log(`${varName}: ${value.substring(0, 25)}...`);
  } else if (varName === 'JWT_SECRET' && value) {
    // Não mostrar o segredo JWT, apenas indicar que está definido
    console.log(`${varName}: [DEFINIDO]`);
  } else {
    console.log(`${varName}: ${value || 'NÃO DEFINIDO'}`);
  }
});

// Verificar a conectividade de rede para o banco de dados
if (process.env.DATABASE_URL) {
  const url = new URL(process.env.DATABASE_URL);
  console.log('\nInformações do banco de dados:');
  console.log(`Hostname: ${url.hostname}`);
  console.log(`Porta: ${url.port || 'padrão'}`);
  console.log(`Username: ${url.username}`);
  console.log(`Database: ${url.pathname.replace('/', '')}`);
  
  // Tentar resolver o DNS do hostname
  const dns = require('dns');
  console.log('\nVerificando DNS do banco de dados...');
  dns.lookup(url.hostname, (err, address) => {
    if (err) {
      console.log(`❌ Erro ao resolver DNS para ${url.hostname}: ${err.message}`);
    } else {
      console.log(`✅ Hostname ${url.hostname} resolvido para IP: ${address}`);
    }
  });
}

// Verificar variáveis de ambiente adicionais
console.log('\nTodas as variáveis de ambiente:');
Object.keys(process.env)
  .filter(key => !key.startsWith('npm_'))
  .sort()
  .forEach(key => {
    const value = process.env[key];
    if (key.includes('DATABASE') || key.includes('SECRET') || key.includes('PASSWORD') || key.includes('KEY')) {
      console.log(`${key}: [VALOR SENSÍVEL]`);
    } else {
      console.log(`${key}: ${value}`);
    }
  });

console.log('\n=== FIM DA VERIFICAÇÃO DE PRÉ-DEPLOY ===');
