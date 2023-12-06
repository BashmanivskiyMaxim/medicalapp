import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { DoctorEntity } from '../entities/doctor.entity';
import { DoctorRepositoryInterface } from '../../domain/repositories/doctor.repository.interface';

@Injectable()
export class DoctorRepository
  extends BaseAbstractRepository<DoctorEntity>
  implements DoctorRepositoryInterface
{
  constructor(
    @InjectRepository(DoctorEntity)
    private readonly doctorEntity: Repository<DoctorEntity>,
  ) {
    super(doctorEntity);
  }

  public async findoctor(): Promise<DoctorEntity | undefined> {
    return await this.doctorEntity.findOne({});
  }
}
