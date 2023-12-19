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
      id: contactInfo.id,
      accountId: { id: contactInfo.accountId },
      contactNumber: contactInfo.contactNumber,
    });
    return this.contactInfoEntityRepository.save(contactInfoEntity);
  }
  updateContactInfo(contactInfo: ContactInfoModel): Promise<any> {
    return this.contactInfoEntityRepository.update(contactInfo.id, {
      id: contactInfo.id,
      accountId: { id: contactInfo.accountId },
      contactNumber: contactInfo.contactNumber,
    });
  }
  deleteContactInfo(contactInfo: ContactInfoModel): Promise<any> {
    return this.contactInfoEntityRepository.delete(contactInfo.id);
  }
  getContactInfo(contactInfo: ContactInfoModel): Promise<any> {
    return this.contactInfoEntityRepository.findOne({
      where: { id: contactInfo.id },
    });
  }
}
