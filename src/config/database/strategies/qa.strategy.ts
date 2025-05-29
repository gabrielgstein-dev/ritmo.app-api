import { DataSourceOptions } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { DatabaseConnectionStrategy } from '../database-connection.strategy';

export class QaDatabaseStrategy implements DatabaseConnectionStrategy {
  getConnectionOptions(): DataSourceOptions {
    // No Render, quando o banco de dados e o serviço web estão no mesmo ambiente,
    // vamos usar os parâmetros individuais de conexão em vez da URL completa
    
    // Definir os parâmetros de conexão com o banco de dados
    const dbHost = process.env.DB_HOST || 'dpg-d0reskumcj7s7387b6t0-a';
    const dbPort = parseInt(process.env.DB_PORT || '5432', 10);
    const dbUsername = process.env.DB_USERNAME || 'ritmodb_user';
    const dbPassword = process.env.DB_PASSWORD || 'mO3C7prhkLyfshsO6Qt5vz26A9rK7iQp';
    const dbDatabase = process.env.DB_DATABASE || 'ritmodb';
    
    // Logs detalhados para depuração
    console.log('=== Configuração de Banco de Dados (QA) ===');
    console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
    console.log(`Host: ${dbHost}`);
    console.log(`Port: ${dbPort}`);
    console.log(`Database: ${dbDatabase}`);
    console.log(`Username: ${dbUsername}`);
    console.log(`DB_SYNCHRONIZE: ${process.env.DB_SYNCHRONIZE}`);
    console.log(`DB_MIGRATIONS_RUN: ${process.env.DB_MIGRATIONS_RUN}`);
    console.log(`DB_SSL: ${process.env.DB_SSL}`);
    console.log(`Tentando conectar ao banco de dados usando parâmetros individuais...`);

    // Configurações de conexão para o PostgreSQL no Render usando parâmetros individuais
    const options: PostgresConnectionOptions = {
      type: 'postgres',
      host: dbHost,
      port: dbPort,
      username: dbUsername,
      password: dbPassword,
      database: dbDatabase,
      entities: [__dirname + '/../../../**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/../../../migrations/**/*{.ts,.js}'],
      synchronize: process.env.DB_SYNCHRONIZE === 'true',
      migrationsRun: process.env.DB_MIGRATIONS_RUN === 'true',
      // Configuração de SSL adaptada para conexões no Render
      ssl:
        process.env.DB_SSL === 'false'
          ? false
          : {
              rejectUnauthorized: false,
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
