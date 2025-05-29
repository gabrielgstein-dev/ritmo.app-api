import { DataSourceOptions } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { DatabaseConnectionStrategy } from '../database-connection.strategy';

export class QaDatabaseStrategy implements DatabaseConnectionStrategy {
  getConnectionOptions(): DataSourceOptions {
    // Priorizar a URL interna do Render, depois a URL externa, depois o fallback
    const dbUrl =
      process.env.INTERNAL_DATABASE_URL ||
      process.env.DATABASE_URL ||
      'postgresql://ritmodb_user:mO3C7prhkLyfshsO6Qt5vz26A9rK7iQp@dpg-d0reskumcj7s7387b6t0-a.oregon-postgres.render.com/ritmodb';
      
    // Verificar se estamos usando a URL interna do Render
    const isInternalUrl = dbUrl.includes('@dpg-') && !dbUrl.includes('.oregon-postgres.render.com');

    // Logs detalhados para depuração
    console.log('=== Configuração de Banco de Dados (QA) ===');
    console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
    console.log(`Usando URL de banco: ${dbUrl.substring(0, 20)}...`);
    console.log(`É URL interna do Render? ${isInternalUrl ? 'Sim' : 'Não'}`);
    console.log(`DB_SYNCHRONIZE: ${process.env.DB_SYNCHRONIZE}`);
    console.log(`DB_MIGRATIONS_RUN: ${process.env.DB_MIGRATIONS_RUN}`);
    console.log(`DB_SSL: ${process.env.DB_SSL}`);
    console.log(`Hostname do banco: ${new URL(dbUrl).hostname}`);
    console.log(`Tentando conectar ao banco de dados...`);
    
    // Configurações de conexão para o PostgreSQL no Render
    const options: PostgresConnectionOptions = {
      type: 'postgres',
      url: dbUrl,
      entities: [__dirname + '/../../../**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/../../../migrations/**/*{.ts,.js}'],
      synchronize: process.env.DB_SYNCHRONIZE === 'true',
      migrationsRun: process.env.DB_MIGRATIONS_RUN === 'true',
      // Configuração de SSL adaptada para URLs internas e externas
      ssl: process.env.DB_SSL === 'false' ? false : {
        rejectUnauthorized: false
      },
      // Adicionar logs para depuração da conexão
      logging: true,
      extra: {
        // Configurações otimizadas para o Render
        max: 10, // Reduzir o número máximo de conexões para evitar sobrecarga
        connectionTimeoutMillis: 60000, // Aumentar timeout de conexão: 60 segundos
        query_timeout: 30000, // Aumentar timeout de query: 30 segundos
        idle_in_transaction_session_timeout: 30000, // Aumentar timeout de transação: 30 segundos
      },
    };
    console.log('Configuração de banco de dados carregada com sucesso');
    return options;
  }
}
