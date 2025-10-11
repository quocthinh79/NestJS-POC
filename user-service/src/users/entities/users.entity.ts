import { IsEmail, IsString, Length } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsString()
  @Length(2, 30)
  @Column({ nullable: true })
  name: string;

  @IsString()
  @Length(2, 30)
  @Column()
  username: string;

  @IsEmail()
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;
}
