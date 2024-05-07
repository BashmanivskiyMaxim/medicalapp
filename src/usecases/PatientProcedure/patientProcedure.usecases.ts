import { PatientProcedureRepository } from 'src/domain/repositories/patientProcedure.repository';
import { ForbiddenException, Logger } from '@nestjs/common';
import { ProcedureRepository } from 'src/domain/repositories/procedure.repository';
import { PatientProcedureModel } from 'src/domain/model/patientProcedureModel';
import { DoctorRepository } from 'src/domain/repositories/doctor.repository.interface';
import { PatientRepository } from 'src/domain/repositories/patient.repository.interface';

export class addPatientProcedureUseCases {
  constructor(
    private readonly logger: Logger,
    private readonly procedureRepository: ProcedureRepository,
    private readonly doctorRepository: DoctorRepository,
    private readonly patientRepository: PatientRepository,
    private readonly patientProcedureRepository: PatientProcedureRepository,
  ) {}
  private ensureIsAdmin(accountType: string) {
    if (accountType !== 'admin') {
      throw new ForbiddenException(
        'Permission denied. Only admin can execute this operation.',
      );
    }
  }

  private ensureIsDoctor(accountType: string) {
    if (accountType !== 'doctor' && accountType !== 'admin') {
      throw new ForbiddenException(
        'Permission denied. Only doctors or admin can execute this operation.',
      );
    }
  }

  async add(
    data: PatientProcedureModel,
    account,
  ): Promise<PatientProcedureModel> {
    this.ensureIsAdmin(account.accountType);
    const procedure = await this.procedureRepository.getDoctorByProcedureId(
      data.procedureId,
    );
    if (!procedure) {
      throw new ForbiddenException('Procedure not found');
    }
    const patientProcedure = new PatientProcedureModel();
    patientProcedure.doctorId = procedure.doctor.id;
    patientProcedure.patientId = 21;
    patientProcedure.procedureId = data.procedureId;
    patientProcedure.procedureDate = new Date();
    patientProcedure.createdDate = new Date();
    patientProcedure.updatedDate = new Date();
    patientProcedure.appointmentTime = data.appointmentTime;
    patientProcedure.report = { report: 'report' };
    patientProcedure.rating = 0;
    const result =
      await this.patientProcedureRepository.createPatientProcedure(
        patientProcedure,
      );
    this.logger.log(
      'addPatientProcedureUseCases execute',
      'New patient procedure have been inserted',
    );
    return result;
  }

  async update(account, id: string): Promise<PatientProcedureModel> {
    const patient = await this.patientRepository.getPatientByAccountId(
      account.id,
    );
    if (!patient) {
      throw new ForbiddenException('Patient not found');
    }
    const patientProcedure = new PatientProcedureModel();
    patientProcedure.patientId = patient.id;
    patientProcedure.updatedDate = new Date();
    const result = await this.patientProcedureRepository.updatePatientProcedure(
      +id,
      patientProcedure,
    );
    this.logger.log(
      'updatePatientProcedureUseCases execute',
      'Patient procedure have been updated',
    );
    return result;
  }

  async delete(id: string, account: { accountType: string }) {
    this.ensureIsAdmin(account.accountType);
    await this.patientProcedureRepository.deletePatientProcedure(+id);
    this.logger.log(
      'deletePatientProcedureUseCases execute',
      'Patient procedure have been deleted',
    );
  }

  //async getById(id: string): Promise<PatientProcedureModel> {
  //  const patientProcedure =
  //    await this.patientProcedureRepository.getPatientProcedureById(+id);
  //}
}
