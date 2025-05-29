import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { DatabaseConfig } from './config/database/database-config';

// Carregar o arquivo .env correto com base no ambiente
const env = process.env.NODE_ENV || 'development';
const envFile = env === 'production' ? '.env' : `.env.${env}`;

// Carregar as variáveis de ambiente do arquivo correto
console.log(`Carregando variáveis de ambiente do arquivo: ${envFile}`);
config({ path: envFile });

// Inicializar a configuração do banco de dados
DatabaseConfig.initialize();

export const dataSourceOptions = DatabaseConfig.getConnectionOptions();

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
