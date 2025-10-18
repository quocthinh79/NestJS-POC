import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Le Quoc Thinh', description: 'User name' })
  @IsString()
  @Length(2, 30)
  name: string;

  @ApiProperty({ example: 'test@example.com', description: 'User email address' })
  @IsEmail()
  email: string;
}
