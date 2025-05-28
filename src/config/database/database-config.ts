import { DatabaseConnectionFactory } from './database-connection.strategy';
import {
  DevelopmentDatabaseStrategy,
  QaDatabaseStrategy,
  ProductionDatabaseStrategy,
} from './strategies';

export class DatabaseConfig {
  static initialize(): void {
    const factory = DatabaseConnectionFactory.getInstance();
    const nodeEnv = process.env.NODE_ENV || 'development';

    switch (nodeEnv) {
      case 'production':
        factory.setStrategy(new ProductionDatabaseStrategy());
        break;
      case 'qa':
        factory.setStrategy(new QaDatabaseStrategy());
        break;
      default:
        factory.setStrategy(new DevelopmentDatabaseStrategy());
        break;
    }
  }

  static getConnectionOptions() {
    return DatabaseConnectionFactory.getInstance().getConnectionOptions();
  }
}
