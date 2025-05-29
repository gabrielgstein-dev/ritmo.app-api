const { Client } = require('pg');
require('dotenv').config({ path: '.env.qa' });

// Função para testar a conexão com o banco de dados
async function testDatabaseConnection() {
  console.log('=== Teste de Conexão com o Banco de Dados ===');
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
  
  // Usar a URL do banco de dados do arquivo .env.qa
  const dbUrl = process.env.DATABASE_URL || 
    'postgresql://ritmodb_user:mO3C7prhkLyfshsO6Qt5vz26A9rK7iQp@dpg-d0reskumcj7s7387b6t0-a.oregon-postgres.render.com/ritmodb';
  
  console.log(`Tentando conectar ao banco de dados: ${dbUrl.substring(0, 20)}...`);
  
  const client = new Client({
    connectionString: dbUrl,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    // Tentar conectar ao banco de dados
    await client.connect();
    console.log('✅ Conexão estabelecida com sucesso!');
    
    // Executar uma consulta simples para verificar se o banco está funcionando
    const res = await client.query('SELECT NOW() as time');
    console.log(`✅ Consulta executada com sucesso. Hora do servidor: ${res.rows[0].time}`);
    
    // Verificar as tabelas disponíveis
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('✅ Tabelas disponíveis no banco de dados:');
    if (tables.rows.length === 0) {
      console.log('   Nenhuma tabela encontrada.');
    } else {
      tables.rows.forEach(row => {
        console.log(`   - ${row.table_name}`);
      });
    }
    
  } catch (err) {
    console.error('❌ Erro ao conectar ao banco de dados:');
    console.error(err);
  } finally {
    // Fechar a conexão
    await client.end();
    console.log('Conexão fechada.');
  }
}

// Executar o teste
testDatabaseConnection();
