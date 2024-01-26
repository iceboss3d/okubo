import { DataSource, DataSourceOptions } from 'typeorm';

type TDataSourceOptions = DataSourceOptions & { autoLoadEntities?: true };

export const dataSourceOptions = (): TDataSourceOptions => ({
  type: 'postgres',
  entities: ['dist/**/*.entity.js'],
  url: process.env.DATABASE_URL,
  synchronize: true,
});

const dataSource = new DataSource(dataSourceOptions());

export { dataSource };
