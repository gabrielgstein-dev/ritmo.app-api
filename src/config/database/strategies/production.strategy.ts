import { DataSourceOptions } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { DatabaseConnectionStrategy } from '../database-connection.strategy';

export class ProductionDatabaseStrategy implements DatabaseConnectionStrategy {
  getConnectionOptions(): DataSourceOptions {
    const baseOptions = this.getBaseOptions();
    if (process.env.DB_SOCKET_PATH) {
      console.log('Conectando ao banco de dados de produção via Cloud SQL socket');
      
      return {
        ...baseOptions,
        host: process.env.DB_SOCKET_PATH,
        extra: {
          socketPath: process.env.DB_SOCKET_PATH,
        },
      } as PostgresConnectionOptions;
    } else {
      console.log('Conectando ao banco de dados de produção via TCP/IP');
      
      return {
        ...baseOptions,
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432', 10),
      } as PostgresConnectionOptions;
    }
  }

  private getBaseOptions(): Partial<PostgresConnectionOptions> {
    return {
      type: 'postgres',
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [__dirname + '/../../../**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/../../../migrations/**/*{.ts,.js}'],
      synchronize: process.env.DB_SYNCHRONIZE === 'true',
      migrationsRun: process.env.DB_MIGRATIONS_RUN === 'true',
    };
  }
}
