import { DataSourceOptions } from 'typeorm';

export interface DatabaseConnectionStrategy {
  getConnectionOptions(): DataSourceOptions;
}

export class DatabaseConnectionFactory {
  private static instance: DatabaseConnectionFactory;
  private strategy: DatabaseConnectionStrategy;

  private constructor() {}

  public static getInstance(): DatabaseConnectionFactory {
    if (!DatabaseConnectionFactory.instance) {
      DatabaseConnectionFactory.instance = new DatabaseConnectionFactory();
    }
    return DatabaseConnectionFactory.instance;
  }

  public setStrategy(strategy: DatabaseConnectionStrategy): void {
    this.strategy = strategy;
  }

  public getConnectionOptions(): DataSourceOptions {
    if (!this.strategy) {
      throw new Error('Database connection strategy not set');
    }
    return this.strategy.getConnectionOptions();
  }
}
