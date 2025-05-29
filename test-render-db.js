// Script para testar a conexão com o banco de dados no Render
const { Client } = require('pg');

console.log('=== TESTE DE CONEXÃO COM O BANCO DE DADOS NO RENDER ===');
console.log(`Data e hora: ${new Date().toISOString()}`);

// Configurações do banco de dados fornecidas pelo usuário
const dbConfig = {
  host: 'dpg-d0reskumcj7s7387b6t0-a',
  port: 5432,
  database: 'ritmodb',
  user: 'ritmodb_user',
  password: 'mO3C7prhkLyfshsO6Qt5vz26A9rK7iQp',
  ssl: {
    rejectUnauthorized: false
  }
};

// URL externa do banco de dados
const externalUrl = 'postgresql://ritmodb_user:mO3C7prhkLyfshsO6Qt5vz26A9rK7iQp@dpg-d0reskumcj7s7387b6t0-a.oregon-postgres.render.com/ritmodb';

// URL interna do banco de dados
const internalUrl = 'postgresql://ritmodb_user:mO3C7prhkLyfshsO6Qt5vz26A9rK7iQp@dpg-d0reskumcj7s7387b6t0-a/ritmodb';

// Função para testar a conexão usando parâmetros individuais
async function testConnectionWithParams() {
  console.log('\n1. Testando conexão com parâmetros individuais:');
  console.log(`Host: ${dbConfig.host}`);
  console.log(`Port: ${dbConfig.port}`);
  console.log(`Database: ${dbConfig.database}`);
  console.log(`User: ${dbConfig.user}`);
  
  const client = new Client(dbConfig);
  
  try {
    await client.connect();
    console.log('✅ Conexão estabelecida com sucesso usando parâmetros individuais!');
    
    const res = await client.query('SELECT NOW() as time');
    console.log(`✅ Consulta executada com sucesso. Hora do servidor: ${res.rows[0].time}`);
    
    return true;
  } catch (err) {
    console.error('❌ Erro ao conectar usando parâmetros individuais:');
    console.error(err.message);
    return false;
  } finally {
    await client.end();
  }
}

// Função para testar a conexão usando a URL externa
async function testConnectionWithExternalUrl() {
  console.log('\n2. Testando conexão com URL externa:');
  console.log(`URL: ${externalUrl.substring(0, 30)}...`);
  
  const client = new Client({
    connectionString: externalUrl,
    ssl: {
      rejectUnauthorized: false
    }
  });
  
  try {
    await client.connect();
    console.log('✅ Conexão estabelecida com sucesso usando URL externa!');
    
    const res = await client.query('SELECT NOW() as time');
    console.log(`✅ Consulta executada com sucesso. Hora do servidor: ${res.rows[0].time}`);
    
    return true;
  } catch (err) {
    console.error('❌ Erro ao conectar usando URL externa:');
    console.error(err.message);
    return false;
  } finally {
    await client.end();
  }
}

// Função para testar a conexão usando a URL interna
async function testConnectionWithInternalUrl() {
  console.log('\n3. Testando conexão com URL interna:');
  console.log(`URL: ${internalUrl.substring(0, 30)}...`);
  
  const client = new Client({
    connectionString: internalUrl,
    ssl: {
      rejectUnauthorized: false
    }
  });
  
  try {
    await client.connect();
    console.log('✅ Conexão estabelecida com sucesso usando URL interna!');
    
    const res = await client.query('SELECT NOW() as time');
    console.log(`✅ Consulta executada com sucesso. Hora do servidor: ${res.rows[0].time}`);
    
    return true;
  } catch (err) {
    console.error('❌ Erro ao conectar usando URL interna:');
    console.error(err.message);
    return false;
  } finally {
    await client.end();
  }
}

// Executar todos os testes
async function runAllTests() {
  try {
    const paramsSuccess = await testConnectionWithParams();
    const externalSuccess = await testConnectionWithExternalUrl();
    const internalSuccess = await testConnectionWithInternalUrl();
    
    console.log('\n=== RESUMO DOS TESTES ===');
    console.log(`Conexão com parâmetros individuais: ${paramsSuccess ? '✅ Sucesso' : '❌ Falha'}`);
    console.log(`Conexão com URL externa: ${externalSuccess ? '✅ Sucesso' : '❌ Falha'}`);
    console.log(`Conexão com URL interna: ${internalSuccess ? '✅ Sucesso' : '❌ Falha'}`);
    
    if (paramsSuccess || externalSuccess || internalSuccess) {
      console.log('\n✅ Pelo menos um método de conexão funcionou!');
      
      if (internalSuccess) {
        console.log('👉 Recomendação: Use a URL interna no Render para melhor desempenho.');
      } else if (externalSuccess) {
        console.log('👉 Recomendação: Use a URL externa, mas considere configurar regras de firewall no Render.');
      } else {
        console.log('👉 Recomendação: Use os parâmetros individuais de conexão.');
      }
    } else {
      console.log('\n❌ Todos os métodos de conexão falharam!');
      console.log('👉 Verifique as credenciais e a configuração do banco de dados no Render.');
    }
  } catch (err) {
    console.error('Erro ao executar os testes:', err);
  }
}

// Executar os testes
runAllTests();
