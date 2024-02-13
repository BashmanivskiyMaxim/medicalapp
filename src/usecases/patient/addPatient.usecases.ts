import { ILogger } from 'src/domain/logger/logger.interface';
import { PatientRepository } from 'src/domain/repositories/patient.repository.interface';
import { PatientModel } from 'src/domain/model/patientModel';
import { ForbiddenException } from '@nestjs/common';
import { DoctorRepository } from 'src/domain/repositories/doctor.repository.interface';
import { EntityValidator } from '../utils/checkExistense.usecases';

export class addPatientUseCases {
  constructor(
    private readonly logger: ILogger,
    private readonly patientRepository: PatientRepository,
    private readonly doctorRepository: DoctorRepository,
    private readonly EntityValidator: EntityValidator,
  ) {}

  private ensureIsDoctor(accountType: string) {
    if (accountType !== 'doctor' && accountType !== 'admin') {
      throw new ForbiddenException(
        'Permission denied. Only doctors can execute this operation.',
      );
    }
  }
  private async ensureIsExistence(patientId: number, doctorId: number) {
    const result = await this.patientRepository.getPatient(patientId, doctorId);
    if (!result) {
      throw new ForbiddenException(
        'Permission denied. Patient does not exist.',
      );
    }
  }
  async execute(accountDoctor: any, patientId: number): Promise<PatientModel> {
    this.ensureIsDoctor(accountDoctor.accountType);
    const doctor = await this.doctorRepository.findByAccountId(
      +accountDoctor.id,
    );
    const patient = new PatientModel();
    patient.accountId = +patientId;
    patient.doctorId = +doctor.id;
    const result = await this.patientRepository.createPatient(patient);
    this.logger.log(
      'addPatientUseCases execute',
      'New patient have been inserted',
    );
    return result;
  }

  // add patient complete info to db
  async deletePatient(
    accountDoctor: any,
    patient_id: string,
  ): Promise<PatientModel> {
    this.ensureIsDoctor(accountDoctor.accountType);
    const doctor = await this.doctorRepository.findByAccountId(
      +accountDoctor.id,
    );
    await this.ensureIsExistence(+patient_id, +doctor.id);
    const result = await this.patientRepository.deletePatient(+patient_id);
    this.logger.log(
      'deletePatientUseCases execute',
      'Patient have been deleted',
    );
    return result;
  }

  async getPatients(accountDoctor: any): Promise<PatientModel> {
    this.ensureIsDoctor(accountDoctor.accountType);
    const doctor = await this.doctorRepository.findByAccountId(
      +accountDoctor.id,
    );
    const result = await this.patientRepository.getPatients(+doctor.id);
    this.logger.log(
      'getPatientsUseCases execute',
      'Patient have been retrieved',
    );
    return result;
  }
}
