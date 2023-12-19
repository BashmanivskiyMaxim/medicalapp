import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { MedicalProcedureEntity } from '../entities/medicalProcedure.entity';
import { MedicalProcedureRepository } from '../../domain/repositories/medicalProcedure.repository.interface';
import { MedicalProcedureModel } from 'src/domain/model/medicalProcedureModel';

@Injectable()
export class DatabaseMedicalProcedureRepository
  extends BaseAbstractRepository<MedicalProcedureEntity>
  implements MedicalProcedureRepository
{
  constructor(
    @InjectRepository(MedicalProcedureEntity)
    private readonly medicalProcedureEntityRepository: Repository<MedicalProcedureEntity>,
  ) {
    super(medicalProcedureEntityRepository);
  }
  createMedicalProcedure(
    medicalProcedure: MedicalProcedureModel,
  ): Promise<any> {
    const medicalProcedureEntity = this.medicalProcedureEntityRepository.create(
      {
        id: medicalProcedure.id,
        procedureType: medicalProcedure.procedureType,
        description: medicalProcedure.description,
      },
    );
    return this.medicalProcedureEntityRepository.save(medicalProcedureEntity);
  }
  updateMedicalProcedure(
    medicalProcedure: MedicalProcedureModel,
  ): Promise<any> {
    return this.medicalProcedureEntityRepository.update(medicalProcedure.id, {
      id: medicalProcedure.id,
      procedureType: medicalProcedure.procedureType,
      description: medicalProcedure.description,
    });
  }
  deleteMedicalProcedure(
    medicalProcedure: MedicalProcedureModel,
  ): Promise<any> {
    return this.medicalProcedureEntityRepository.delete(medicalProcedure.id);
  }
}
