// data-source.ts
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './common/entities/users.entity';
import { Post } from '@nestjs/common';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3307,
  username: 'root',
  password: 'root',
  database: 'nestjs_db',
  entities: [User, Post],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  migrationsRun: false, // <— important
});
