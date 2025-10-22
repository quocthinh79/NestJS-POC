import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './users.entity';
import { IsOptional, IsString } from 'class-validator';

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsString()
  @ManyToOne(() => User, user => user.id)
  @Column({ type: 'uuid' })
  ownerId: string;

  @IsString()
  @Column({ type: 'text' })
  title: string;

  @IsString()
  @Column({ type: 'text' })
  content: string;

  @IsString()
  @IsOptional()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createDate: Date;
}
