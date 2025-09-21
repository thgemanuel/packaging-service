import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import * as path from 'path';

const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [path.join(__dirname, '/schemas/**/*{.ts,.js}')],
  migrations: [
    path.join(__dirname, '/migrations/**/*{.ts,.js}'),
    path.join(__dirname, '/seeds/**/*{.seeder.ts,.seeder.js}'),
  ],
};

export default new DataSource(options);
