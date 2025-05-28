import { DataSourceOptions } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { DatabaseConnectionStrategy } from '../database-connection.strategy';

export class QaDatabaseStrategy implements DatabaseConnectionStrategy {
  getConnectionOptions(): DataSourceOptions {
    // Usar a URL de conexão externa completa para o Render
    const dbUrl = process.env.DATABASE_URL || 'postgresql://ritmodb_user:mO3C7prhkLyfshsO6Qt5vz26A9rK7iQp@dpg-d0reskumcj7s7387b6t0-a.oregon-postgres.render.com/ritmodb';
    
    return {
      type: 'postgres',
      url: dbUrl,
      entities: [__dirname + '/../../../**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/../../../migrations/**/*{.ts,.js}'],
      synchronize: process.env.DB_SYNCHRONIZE === 'true',
      migrationsRun: process.env.DB_MIGRATIONS_RUN === 'true',
      ssl: true,
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
    } as PostgresConnectionOptions;
  }
}
