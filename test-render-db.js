// Script para testar a conexão com o banco de dados no Render
const { Client } = require('pg');

console.log('=== Iniciando teste de conexão com o banco de dados ===');
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);

// Verificar se as variáveis de ambiente estão definidas
console.log('Verificando variáveis de ambiente:');
console.log(`DB_HOST definida: ${process.env.DB_HOST ? 'Sim' : 'Não'}`);
console.log(`DB_PORT definida: ${process.env.DB_PORT ? 'Sim' : 'Não'}`);
console.log(`DB_USERNAME definida: ${process.env.DB_USERNAME ? 'Sim' : 'Não'}`);
console.log(`DB_PASSWORD definida: ${process.env.DB_PASSWORD ? 'Sim' : 'Não'}`);
console.log(`DB_DATABASE definida: ${process.env.DB_DATABASE ? 'Sim' : 'Não'}`);
console.log(`DB_SSL definida: ${process.env.DB_SSL ? 'Sim' : 'Não'}`);

// Configurar informações de conexão usando parâmetros individuais
const connectionInfo = {
  host: process.env.DB_HOST || 'dpg-d0reskumcj7s7387b6t0-a',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_DATABASE || 'ritmodb',
  user: process.env.DB_USERNAME || 'ritmodb_user',
  password: process.env.DB_PASSWORD || 'mO3C7prhkLyfshsO6Qt5vz26A9rK7iQp',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
};

console.log('Informações de conexão:');
console.log(`Host: ${connectionInfo.host}`);
console.log(`Port: ${connectionInfo.port}`);
console.log(`Database: ${connectionInfo.database}`);
console.log(`User: ${connectionInfo.user}`);
console.log(`SSL: ${process.env.DB_SSL}`);

// Função para testar a conexão usando parâmetros individuais
async function testConnection() {
  console.log('\n=== Testando conexão com o banco de dados ===');
  
  const client = new Client(connectionInfo);
  
  try {
    await client.connect();
    console.log('✅ Conexão estabelecida com sucesso!');
    
    const res = await client.query('SELECT NOW() as time');
    console.log(`✅ Consulta executada com sucesso. Hora do servidor: ${res.rows[0].time}`);
    
    return true;
  } catch (error) {
    console.error(`❌ Erro ao conectar: ${error.message}`);
    
    // Tentar resolver o nome do host para diagnóstico
    try {
      const dns = require('dns');
      dns.lookup(connectionInfo.host, (err, address, family) => {
        if (err) {
          console.error(`❌ Não foi possível resolver o hostname ${connectionInfo.host}: ${err.message}`);
        } else {
          console.log(`✅ Hostname ${connectionInfo.host} resolvido para ${address} (IPv${family})`);
        }
      });
    } catch (dnsError) {
      console.error(`❌ Erro ao tentar resolver o hostname: ${dnsError.message}`);
    }
    
    return false;
  } finally {
    await client.end();
  }
}

// Executar o teste e mostrar um resumo
async function runTests() {
  console.log('\n=== Iniciando teste de conexão ===');
  
  const success = await testConnection();
  
  console.log('\n=== Resumo do teste ===');
  console.log(`Conexão com o banco de dados: ${success ? '✅ Sucesso' : '❌ Falha'}`);
  
  // Fornecer recomendações com base nos resultados
  console.log('\n=== Recomendações ===');
  if (success) {
    console.log('👉 A conexão com o banco de dados está funcionando corretamente.');
    console.log('👉 A aplicação deve funcionar normalmente no Render.');
  } else {
    console.log('\n=== ❌ ALERTA: A conexão com o banco de dados falhou! ===');
    console.log('👉 Verifique se as variáveis de ambiente estão configuradas corretamente no Render.');
    console.log('👉 Verifique se o banco de dados está acessível a partir do serviço web no Render.');
    console.log('👉 Verifique se as credenciais do banco de dados estão corretas.');
  }
}

// Executar os testes
runTests();
