import { Controller } from '@nestjs/common';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Post } from '../common/entities/posts.entity';
import { PostService } from './posts.service';

@Controller()
export class PostsController {
  constructor(private readonly postService: PostService) {}

  @MessagePattern('create_post')
  async createPost(data: Partial<Post>) {
    const dto = plainToInstance(Post, { ...data });
    const errors = await validate(dto);

    if (errors.length > 0) {
      throw new RpcException('Validation failed: ' + JSON.stringify(errors));
    }

    return this.postService.create(data);
  }
}
