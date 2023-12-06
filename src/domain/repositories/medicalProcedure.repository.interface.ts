import { BaseInterfaceRepository } from '@app/shared';
import { MedicalProcedureEntity } from '../entities/medicalProcedure.entity';

export interface MedicalProcedureRepositoryInterface
  extends BaseInterfaceRepository<MedicalProcedureEntity> {
  findproc(
    userId: number,
    friendId: number,
  ): Promise<MedicalProcedureEntity | undefined>;
}
