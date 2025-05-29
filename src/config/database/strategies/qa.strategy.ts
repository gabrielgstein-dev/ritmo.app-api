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

    console.log('Conectando ao banco de dados com URL:', dbUrl);
    console.log('NODE_ENV:', process.env.NODE_ENV);
    
    // Configurações de conexão para o PostgreSQL no Render
    return {
      type: 'postgres',
      url: dbUrl,
      entities: [__dirname + '/../../../**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/../../../migrations/**/*{.ts,.js}'],
      synchronize: process.env.DB_SYNCHRONIZE === 'true',
      migrationsRun: process.env.DB_MIGRATIONS_RUN === 'true',
      ssl: process.env.DB_SSL === 'false' ? false : {
        rejectUnauthorized: false
      },
      extra: {
        // Configurações adicionais para melhorar a conexão
        max: 20, // Máximo de conexões no pool
        connectionTimeoutMillis: 30000, // Timeout de conexão: 30 segundos
        query_timeout: 10000, // Timeout de query: 10 segundos
        idle_in_transaction_session_timeout: 10000, // Timeout de transação: 10 segundos
      },
      logging: ['error', 'warn', 'info', 'log'],
    } as PostgresConnectionOptions;
  }
}
