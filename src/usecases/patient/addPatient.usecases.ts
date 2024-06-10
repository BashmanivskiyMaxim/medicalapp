import { ILogger } from '../../domain/logger/logger.interface';
import { PatientRepository } from '../../domain/repositories/patient.repository.interface';
import { PatientModel } from '../../domain/model/patientModel';
import { ForbiddenException } from '@nestjs/common';
import { DoctorRepository } from '../../domain/repositories/doctor.repository.interface';
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
  private async ensureIsExistence(patientId: number) {
    const result = await this.patientRepository.getPatient(patientId);
    if (!result) {
      throw new ForbiddenException(
        'Permission denied. Patient does not exist.',
      );
    }
  }
  async execute(account: any): Promise<PatientModel> {
    const patient = new PatientModel();
    patient.accountId = account.id;
    patient.recovery_status = false;
    patient.additional_info = {
      content: '<p>Додаткова інформація</p>',
    };
    const result = await this.patientRepository.createPatient(patient);
    this.logger.log(
      'addPatientUseCases execute',
      'New patient have been inserted',
    );
    return result;
  }

  async deletePatient(
    accountDoctor: any,
    patient_id: string,
  ): Promise<PatientModel> {
    this.ensureIsDoctor(accountDoctor.accountType);
    await this.ensureIsExistence(+patient_id);
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

  async getMyPatientInfo(account: any): Promise<PatientModel> {
    const patient = await this.patientRepository.getPatient(+account.id);
    if (!patient) {
      throw new ForbiddenException(
        'Permission denied. Patient does not exist.',
      );
    }
    return patient;
  }

  async updatePatient(account: any, addInfo: any): Promise<void> {
    const patient = await this.patientRepository.getPatientByAccountId(
      +account.id,
    );
    if (!patient) {
      throw new ForbiddenException(
        'Permission denied. Patient does not exist.',
      );
    }
    patient.additional_info = addInfo;

    await this.patientRepository.updatePatient(patient);
  }
}
