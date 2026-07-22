import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { User } from './users.entity';

@Entity({ name: 'COUNTRY_INFO' })
export class CountryInfo {
  @PrimaryColumn({ name: 'country_id', type: 'varchar', length: 255 })
  countryId: string;

  @Column({ name: 'country_code', type: 'varchar', length: 10, nullable: true })
  countryCode: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  currency: string;

  @OneToMany(() => User, user => user.country)
  users: User[];
}
