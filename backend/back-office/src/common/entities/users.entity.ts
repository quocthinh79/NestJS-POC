import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AccountStatusEnum } from '../enums/account-status.enum';
import { AuthProviderEnum } from '../enums/auth-provider.enum';
import { ThemeEnum } from '../enums/theme.enum';
import { CountryInfo } from './country-info.entity';
import { AffiliateInfo } from './affiliate-info.entity';

import { IsEmail, IsOptional, IsString } from 'class-validator';

import { UserStore } from './user-store.entity';

@Entity({ name: 'USER' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'prefer_language', type: 'varchar', length: 10, default: 'vi-VN' })
  preferLanguage: string;

  @Column({
    name: 'auth_provider',
    type: 'enum',
    enum: AuthProviderEnum,
    default: AuthProviderEnum.LOCAL,
  })
  authProvider: AuthProviderEnum;

  @Column({
    name: 'account_status',
    type: 'tinyint',
    enum: AccountStatusEnum,
    default: AccountStatusEnum.ACTIVE,
    comment: '0: Inactive, 1: Active, 2: Banned, 3: Deleted',
  })
  accountStatus: AccountStatusEnum;

  @Column({
    type: 'enum',
    enum: ThemeEnum,
    default: ThemeEnum.SYSTEM,
  })
  theme: ThemeEnum;

  @Column({ type: 'varchar', length: 50, default: 'USER' })
  role: string;

  @Column({ name: 'country_id', type: 'varchar', length: 255, nullable: true })
  countryId: string;

  @ManyToOne(() => CountryInfo, country => country.users, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'country_id' })
  country: CountryInfo;

  @IsOptional()
  @IsEmail()
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 255, nullable: true })
  passwordHash: string;

  @IsOptional()
  @IsString()
  @Column({ type: 'varchar', length: 255, nullable: true })
  username: string;

  @Column({ name: 'avatar_url', type: 'varchar', length: 255, nullable: true })
  avatarUrl: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  bio: string;

  @Column({ name: 'last_login_at', type: 'datetime', nullable: true })
  lastLoginAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'two_factor_enabled', type: 'boolean', default: false })
  twoFactorEnabled: boolean;

  @Column({ name: 'two_factor_secret', type: 'varchar', length: 255, nullable: true })
  twoFactorSecret: string;

  @Column({ name: 'password_expired', type: 'boolean', default: false })
  passwordExpired: boolean;

  @Column({ name: 'failed_login_attempts', type: 'int', default: 0 })
  failedLoginAttempts: number;

  @Column({ name: 'referral_code', type: 'varchar', length: 50, nullable: true })
  referralCode: string;

  @ManyToOne(() => AffiliateInfo, affiliate => affiliate.referredUsers, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'referral_code' })
  affiliateInfo: AffiliateInfo;

  @OneToMany(() => UserStore, (userStore: UserStore) => userStore.user)
  userStores: UserStore[];
}
