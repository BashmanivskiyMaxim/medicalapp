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

  async getById(id: string, account: any) {
    const patient = await this.patientRepository.getPatientByAccountId(
      account.id,
    );
    const patientProcedure =
      await this.patientProcedureRepository.getPatientProcedureById(+id);
    if (!patientProcedure) {
      throw new ForbiddenException('Patient procedure not found');
    }
    if (patient.id !== patientProcedure.patientId) {
      throw new ForbiddenException('Permission denied');
    }
    this.logger.log(
      'getPatientProcedureUseCases execute',
      'Patient procedure have been found',
    );

    return patientProcedure;
  }

  async dailyScheduleProcedure() {
    try {
      const appointmentTime = [
        '9:00',
        '10:00',
        '11:00',
        '12:00',
        '13:00',
        '15:00',
        '16:00',
        '17:00',
      ];
      const procedures = await this.procedureRepository.getProcedures();
      const appointmentsPerProcedure = 8;
      for (const procedure of await procedures) {
        for (let i = 0; i < appointmentsPerProcedure; i++) {
          const patientProcedure = new PatientProcedureModel();
          patientProcedure.doctorId = procedure.doctorId;
          patientProcedure.patientId = 21;
          patientProcedure.procedureId = procedure.id;
          patientProcedure.procedureDate = new Date();
          patientProcedure.createdDate = new Date();
          patientProcedure.updatedDate = new Date();
          patientProcedure.appointmentTime = appointmentTime[i];
          patientProcedure.report = { report: 'report' };
          patientProcedure.rating = 0;
          this.patientProcedureRepository.createPatientProcedure(
            patientProcedure,
          );
        }
      }
      this.logger.log(
        'DailyProceduresSchedulerStrategy',
        'Procedures scheduled',
      );
    } catch (error) {}
  }
  async getAll(account: any) {
    this.ensureIsAdmin(account.accountType);
    const patientProcedures =
      await this.patientProcedureRepository.getAllProcedures();
    this.logger.log(
      'getPatientProceduresUseCases execute',
      'All patient procedures have been fetched',
    );
    return patientProcedures;
  }

  async getMyProcedures(account: any) {
    const patient = await this.patientRepository.getPatientByAccountId(
      account.id,
    );
    if (!patient) {
      throw new ForbiddenException('Patient not found');
    }
    const patientProcedures =
      await this.patientProcedureRepository.getPatientProcedures(patient.id);
    if (!patientProcedures.length) {
      throw new ForbiddenException('Patient procedures not found');
    }
    if (patient.id !== patientProcedures[0].patientId) {
      throw new ForbiddenException('Permission denied');
    }
    this.logger.log(
      'getMyProceduresUseCases execute',
      'All patient procedures have been fetched',
    );
    return patientProcedures;
  }
}
