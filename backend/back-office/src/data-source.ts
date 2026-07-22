import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './common/entities/users.entity';
import { Post } from './common/entities/Posts.entity';
import { CountryInfo } from './common/entities/country-info.entity';
import { AffiliateInfo } from './common/entities/affiliate-info.entity';
import { StoreInfo } from './common/entities/store-info.entity';
import { UserStore } from './common/entities/user-store.entity';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3307,
  username: 'root',
  password: 'root',
  database: 'nestjs_db',
  entities: [User, Post, CountryInfo, AffiliateInfo, StoreInfo, UserStore],
  synchronize: false,
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  migrationsRun: true,
});
