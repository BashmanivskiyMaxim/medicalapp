import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { AccountEntity } from './account.entity';

@Entity('contactInfo')
export class ContactInfoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => AccountEntity, (account) => account.id)
  accountId: AccountEntity;

  @Column()
  contactNumber: string;
}
