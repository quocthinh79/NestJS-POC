import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { StoreInfo } from '../common/entities/store-info.entity';
import { CountryInfo } from '../common/entities/country-info.entity';
import { AffiliateInfo } from '../common/entities/affiliate-info.entity';
import { UserStore } from '../common/entities/user-store.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StoreInfo, CountryInfo, AffiliateInfo, UserStore])],
  controllers: [AdminController],
  providers: [],
  exports: [TypeOrmModule],
})
export class AdminModule {}
