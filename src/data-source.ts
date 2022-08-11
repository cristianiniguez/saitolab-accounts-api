import { DataSource } from 'typeorm';
import { loadEnvironment } from './environments';

loadEnvironment();

export const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: false,
  logging: false,
  migrations: ['src/database/migrations/*.ts'],
  migrationsTableName: 'migrations',
  entities: ['src/**/*.entity.ts'],
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
});
