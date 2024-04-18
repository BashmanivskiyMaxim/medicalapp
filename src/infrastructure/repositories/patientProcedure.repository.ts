import { PatientProcedureRepository } from 'src/domain/repositories/patientProcedure.repository';
import { PatientProcedureEntity } from '../entities/patientProcedure.entity';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PatientProcedureModel } from 'src/domain/model/patientProcedureModel';

export class DatabasePatientProcedureRepository
  extends BaseAbstractRepository<PatientProcedureEntity>
  implements PatientProcedureRepository
{
  constructor(
    @InjectRepository(PatientProcedureEntity)
    private readonly patientProcedureEntityRepository: Repository<PatientProcedureEntity>,
  ) {
    super(patientProcedureEntityRepository);
  }
  createPatientProcedure(
    patientProcedure: PatientProcedureModel,
  ): Promise<any> {
    const patientProcedureEntity = this.patientProcedureEntityRepository.create(
      {
        patient: { id: patientProcedure.patientId },
        procedure: { id: patientProcedure.procedureId },
        procedureDate: patientProcedure.procedureDate,
        createdDate: patientProcedure.createdDate,
        updatedDate: patientProcedure.updatedDate,
        appointmentTime: patientProcedure.appointmentTime,
        report: patientProcedure.report,
        rating: patientProcedure.rating,
      },
    );
    return this.patientProcedureEntityRepository.save(patientProcedureEntity);
  }
  async updatePatientProcedure(patientProcedure: any): Promise<any> {
    return this.patientProcedureEntityRepository.save({
      id: patientProcedure.id,
      ...patientProcedure,
    });
  }
  deletePatientProcedure(patientProcedureId: number): Promise<any> {
    return this.patientProcedureEntityRepository.delete(patientProcedureId);
  }
  getPatientProcedure(patientId: number, doctorId: number): Promise<any> {
    return this.patientProcedureEntityRepository.findOne({
      where: { id: patientId, doctor: { id: doctorId } },
    });
  }
  getPatientProcedures(patientId: number): Promise<any> {
    return this.patientProcedureEntityRepository.find({
      where: { patient: { id: patientId } },
    });
  }
}