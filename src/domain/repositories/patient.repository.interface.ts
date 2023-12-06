import { BaseInterfaceRepository } from '@app/shared';
import { PatientEntity } from '../entities/patient.entity';

export interface PatientRepositoryInterface
  extends BaseInterfaceRepository<PatientEntity> {
  findpatient(
    userId: number,
    friendId: number,
  ): Promise<PatientEntity | undefined>;
}
