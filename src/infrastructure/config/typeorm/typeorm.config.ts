import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

if (process.env.NODE_ENV === 'local') {
  dotenv.config({ path: './env/local.env' });
}
dotenv.config({ path: './env/local.env' });
export const config = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: 'postgres',
  entities: [__dirname + './../../**/*.entity{.ts,.js}'],
  synchronize: false,
  schema: process.env.DATABASE_SCHEMA,
  migrationsRun: true,
  migrationsTableName: 'migration_medical_app',
  migrations: ['database/migrations/**/*{.ts,.js}'],
});

console.log(config);
