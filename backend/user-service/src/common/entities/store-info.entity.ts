import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { UserStore } from './user-store.entity';

@Entity({ name: 'STORE_INFO' })
export class StoreInfo {
  @PrimaryColumn({ name: 'Store_id', type: 'varchar', length: 255 })
  storeId: string;

  @Column({ name: 'store_name', type: 'varchar', length: 255, nullable: true })
  storeName: string;

  @Column({ name: 'store_slug', type: 'varchar', length: 255, nullable: true })
  storeSlug: string;

  @Column({ name: 'website_url', type: 'varchar', length: 255, nullable: true })
  websiteUrl: string;

  @OneToMany(() => UserStore, (userStore: UserStore) => userStore.store)
  userStores: UserStore[];
}
