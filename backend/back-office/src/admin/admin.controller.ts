import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoreInfo } from '../common/entities/store-info.entity';
import { CountryInfo } from '../common/entities/country-info.entity';
import { AffiliateInfo } from '../common/entities/affiliate-info.entity';

@Controller('admin')
export class AdminController {
  constructor(
    @InjectRepository(StoreInfo)
    private readonly storeInfoRepo: Repository<StoreInfo>,
    @InjectRepository(CountryInfo)
    private readonly countryInfoRepo: Repository<CountryInfo>,
    @InjectRepository(AffiliateInfo)
    private readonly affiliateInfoRepo: Repository<AffiliateInfo>,
  ) {}

  @MessagePattern({ cmd: 'get_stores' })
  async getStores() {
    return this.storeInfoRepo.find();
  }

  @MessagePattern({ cmd: 'update_store' })
  async updateStore(@Payload() data: Partial<StoreInfo>) {
    if (data.storeId) {
      await this.storeInfoRepo.update(data.storeId, data);
      return this.storeInfoRepo.findOne({ where: { storeId: data.storeId } });
    }
    return this.storeInfoRepo.save(data);
  }

  @MessagePattern({ cmd: 'get_countries' })
  async getCountries() {
    return this.countryInfoRepo.find();
  }

  @MessagePattern({ cmd: 'get_affiliates' })
  async getAffiliates() {
    return this.affiliateInfoRepo.find();
  }
}
