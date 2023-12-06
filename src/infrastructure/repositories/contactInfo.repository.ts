import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { ContactInfoEntity } from '../entities/contactInfo.entity';
import { ContactInfoRepositoryInterface } from '../../domain/repositories/contactInfo.repository.interface';

@Injectable()
export class ContactInfoRepository
  extends BaseAbstractRepository<ContactInfoEntity>
  implements ContactInfoRepositoryInterface
{
  constructor(
    @InjectRepository(ContactInfoEntity)
    private readonly contactInfoEntity: Repository<ContactInfoEntity>,
  ) {
    super(contactInfoEntity);
  }

  public async findInfo(): Promise<ContactInfoEntity | undefined> {
    return await this.contactInfoEntity.findOne({});
  }
}
