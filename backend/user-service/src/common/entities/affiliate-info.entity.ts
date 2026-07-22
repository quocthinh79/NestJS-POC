import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { User } from './users.entity';

@Entity({ name: 'AFFILIATE_INFO' })
export class AffiliateInfo {
  @PrimaryColumn({ name: 'referral_code', type: 'varchar', length: 50 })
  referralCode: string;

  @Column({ name: 'referred_by', type: 'varchar', length: 255, nullable: true })
  referredBy: string;

  @OneToMany(() => User, user => user.affiliateInfo)
  referredUsers: User[];
}
