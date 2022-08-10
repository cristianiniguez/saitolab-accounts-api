import { DataSource } from 'typeorm';

export const dataSource = new DataSource({
  type: 'postgres',
  url: 'postgresql://root:root@localhost:5432/dev',
  synchronize: false,
  logging: false,
  migrations: ['src/database/migrations/*.ts'],
  migrationsTableName: 'migrations',
  entities: ['src/**/*.entity.ts'],
  ssl: false,
});
