import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';

import { AddressEntity } from '../entities/address.entity';
import { AddressRepositoryInterface } from '../../domain/repositories/address.repository.interface';

@Injectable()
export class AddressRepository
  extends BaseAbstractRepository<AddressEntity>
  implements AddressRepositoryInterface
{
  constructor(
    @InjectRepository(AddressEntity)
    private readonly addressEntity: Repository<AddressEntity>,
  ) {
    super(addressEntity);
  }

  public async findAddress(): Promise<AddressEntity | undefined> {
    return await this.addressEntity.findOne({});
  }
}
