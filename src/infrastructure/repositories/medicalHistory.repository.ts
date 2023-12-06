import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { MedicalHistoryEntity } from '../entities/medicalHistory.entity';
import { MedicalHistoryRepositoryInterface } from '../../domain/repositories/medicalHistory.repository.interface';

@Injectable()
export class MedicalHistoryRepository
  extends BaseAbstractRepository<MedicalHistoryEntity>
  implements MedicalHistoryRepositoryInterface
{
  constructor(
    @InjectRepository(MedicalHistoryEntity)
    private readonly medicalHistoryEntity: Repository<MedicalHistoryEntity>,
  ) {
    super(medicalHistoryEntity);
  }

  public async findmed(): Promise<MedicalHistoryEntity | undefined> {
    return await this.medicalHistoryEntity.findOne({});
  }
}
