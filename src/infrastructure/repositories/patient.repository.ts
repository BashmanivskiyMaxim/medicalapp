import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { PatientEntity } from '../entities/patient.entity';
import { PatientRepositoryInterface } from '../../domain/repositories/patient.repository.interface';

@Injectable()
export class PatientRepository
  extends BaseAbstractRepository<PatientEntity>
  implements PatientRepositoryInterface
{
  constructor(
    @InjectRepository(PatientEntity)
    private readonly patientEntity: Repository<PatientEntity>,
  ) {
    super(patientEntity);
  }

  public async findpatient(): Promise<PatientEntity | undefined> {
    return await this.patientEntity.findOne({});
  }
}
