import { Body, Controller, HttpException, Inject, Post, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CreatePostDto } from './dto/posts.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('posts')
export class PostsController {
  constructor(@Inject('MAIN_SERVICE') private readonly mainClient: ClientProxy) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  async createPost(@Body() dto: CreatePostDto, @CurrentUser('id') ownerId: string) {
    try {
      const result$ = this.mainClient.send('create_post', { ...dto, ownerId });
      return await firstValueFrom(result$);
    } catch (error) {
      console.log('🚀 ~ PostsController ~ createPost ~ error:', error);
      throw new HttpException(error, error?.status);
    }
  }
}
