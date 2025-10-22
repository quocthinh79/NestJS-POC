import { ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

@ApiBearerAuth()
export class CreatePostDto {
  @ApiProperty({ example: 'My First Post', description: 'Post title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'This is the content of my first post', description: 'Post content' })
  @IsString()
  @IsNotEmpty()
  content: string;
}
