import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './users.entity';
import { StoreInfo } from './store-info.entity';
import { RoleInStoreEnum } from '../enums/role-in-store.enum';

@Entity({ name: 'USER_STORE' })
export class UserStore {
  @PrimaryColumn({ name: 'user_id', type: 'varchar', length: 255 })
  userId: string;

  @PrimaryColumn({ name: 'store_id', type: 'varchar', length: 255 })
  storeId: string;

  @CreateDateColumn({ name: 'joined_at' })
  joinedAt: Date;

  @Column({
    name: 'role_in_store',
    type: 'enum',
    enum: RoleInStoreEnum,
    default: RoleInStoreEnum.CUSTOMER_SERVICE,
  })
  roleInStore: RoleInStoreEnum;

  @ManyToOne(() => User, (user: User) => user.userStores, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => StoreInfo, (store: StoreInfo) => store.userStores, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  store: StoreInfo;
}
