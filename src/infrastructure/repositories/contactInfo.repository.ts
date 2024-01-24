import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { ContactInfoEntity } from '../entities/contactInfo.entity';
import { ContactInfoRepository } from '../../domain/repositories/contactInfo.repository.interface';
import { ContactInfoModel } from 'src/domain/model/contactInfoModel';

@Injectable()
export class DatabaseContactInfoRepository
  extends BaseAbstractRepository<ContactInfoEntity>
  implements ContactInfoRepository
{
  constructor(
    @InjectRepository(ContactInfoEntity)
    private readonly contactInfoEntityRepository: Repository<ContactInfoEntity>,
  ) {
    super(contactInfoEntityRepository);
  }
  createContactInfo(contactInfo: ContactInfoModel): Promise<any> {
    const contactInfoEntity = this.contactInfoEntityRepository.create({
      account: { id: contactInfo.accountId },
      contactNumber: contactInfo.contactNumber,
    });
    return this.contactInfoEntityRepository.save(contactInfoEntity);
  }
  findContactInfoByContactNumber(contactNumber: string): Promise<any> {
    return this.contactInfoEntityRepository.findOne({
      where: { contactNumber: contactNumber },
    });
  }
  async updateContactInfo(
    contactInfo: ContactInfoModel,
    account_id: number,
  ): Promise<any> {
    const contactInfoGet = await this.findContactInfoByAccountId(account_id);
    return this.contactInfoEntityRepository.save({
      id: contactInfoGet.id,
      contactNumber: contactInfo.contactNumber,
    });
  }
  deleteContactInfo(id: number): Promise<any> {
    return this.contactInfoEntityRepository.delete(id);
  }
  getContactInfo(contactInfo: ContactInfoModel): Promise<any> {
    return this.contactInfoEntityRepository.findOne({
      where: { id: contactInfo.id },
    });
  }
  findContactInfoByAccountId(accountId: number): Promise<any> {
    return this.contactInfoEntityRepository.findOne({
      where: { account: { id: accountId } },
    });
  }
  getAllContactInfo(): Promise<any> {
    return this.contactInfoEntityRepository.find();
  }
}
