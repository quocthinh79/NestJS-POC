import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({ example: 'test@example.com', description: 'User email address' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Le Quoc Thinh', description: 'User name' })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'strongPassword123', description: 'User password (min length 6)' })
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
