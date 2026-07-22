import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../common/entities/Posts.entity';
import { PostsController } from './posts.controller';
import { PostService } from './posts.service';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), CqrsModule],
  providers: [PostService],
  controllers: [PostsController],
  exports: [PostService],
})
export class PostModule {}
