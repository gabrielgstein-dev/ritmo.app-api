import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { DatabaseConfig } from './config/database/database-config';

config();

DatabaseConfig.initialize();

export const dataSourceOptions = DatabaseConfig.getConnectionOptions();

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
