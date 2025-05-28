import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { DatabaseConfig } from './config/database/database-config';

// Carrega as variáveis de ambiente
config();

// Inicializa a configuração do banco de dados com a estratégia correta
DatabaseConfig.initialize();

// Obtém as opções de conexão da estratégia selecionada
export const dataSourceOptions = DatabaseConfig.getConnectionOptions();

// Cria a fonte de dados usando as opções da estratégia
const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
