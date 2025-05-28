import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

config();

let connectionOptions: any = {
  type: 'postgres',
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  migrationsRun: process.env.DB_MIGRATIONS_RUN === 'true',
};

// Determina o ambiente atual
const nodeEnv = process.env.NODE_ENV || 'development';

// Configuração baseada no ambiente
switch (nodeEnv) {
  case 'production':
    // Ambiente de produção (Cloud Run com Cloud SQL)
    if (process.env.DB_SOCKET_PATH) {
      // Usando Cloud SQL com socket Unix
      connectionOptions = {
        ...connectionOptions,
        host: process.env.DB_SOCKET_PATH,
        extra: {
          socketPath: process.env.DB_SOCKET_PATH,
        },
      };
      console.log('Conectando ao banco de dados de produção via Cloud SQL socket');
    } else {
      // Fallback para conexão TCP/IP em produção
      connectionOptions = {
        ...connectionOptions,
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432', 10),
      };
      console.log('Conectando ao banco de dados de produção via TCP/IP');
    }
    break;

  case 'qa':
    // Ambiente de QA (Render)
    connectionOptions = {
      ...connectionOptions,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      ssl: true,
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
    };
    console.log('Conectando ao banco de dados de QA no Render');
    break;

  default:
    // Ambiente de desenvolvimento (local)
    connectionOptions = {
      ...connectionOptions,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
    };
    console.log('Conectando ao banco de dados de desenvolvimento local');
    break;
}

export const dataSourceOptions: DataSourceOptions = connectionOptions;

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
