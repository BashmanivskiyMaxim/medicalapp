import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { MedicalProcedureEntity } from '../entities/medicalProcedure.entity';
import { MedicalProcedureRepositoryInterface } from '../../domain/repositories/medicalProcedure.repository.interface';

@Injectable()
export class MedicalProcedureRepository
  extends BaseAbstractRepository<MedicalProcedureEntity>
  implements MedicalProcedureRepositoryInterface
{
  constructor(
    @InjectRepository(MedicalProcedureEntity)
    private readonly medicalProcedureEntity: Repository<MedicalProcedureEntity>,
  ) {
    super(medicalProcedureEntity);
  }

  public async findproc(): Promise<MedicalProcedureEntity | undefined> {
    return await this.medicalProcedureEntity.findOne({});
  }
}
