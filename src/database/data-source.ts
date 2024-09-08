import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';
import 'src/common/config/config.env';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

configService.get('DATABASE_PASSWORD')

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: configService.get<string>('DATABASE_HOST'),
  port: +configService.get<number>('DATABASE_PORT'),
  username: configService.get<string>('DATABASE_USER'),
  password: configService.get<string>('DATABASE_PASSWORD'),
  database: configService.get<string>('DATABASE_NAME'),
  entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
  synchronize: false,
  migrations: [join(__dirname, '..', 'database', 'migrations', '*{.ts,.js}')],
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
