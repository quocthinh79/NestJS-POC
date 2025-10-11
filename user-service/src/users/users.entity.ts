import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IsString, IsEmail, Length } from 'class-validator';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @Length(2, 30)
  @Column()
  name: string;

  @IsEmail()
  @Column({ unique: true })
  email: string;
}
