import { ILogger } from 'src/domain/logger/logger.interface';
import { PatientRepository } from 'src/domain/repositories/patient.repository.interface';
import { PatientModel } from 'src/domain/model/patientModel';
import { ForbiddenException } from '@nestjs/common';
import { DoctorRepository } from 'src/domain/repositories/doctor.repository.interface';

export class addPatientUseCases {
  constructor(
    private readonly logger: ILogger,
    private readonly patientRepository: PatientRepository,
    private readonly doctorRepository: DoctorRepository,
  ) {}

  private ensureIsDoctor(accountType: string) {
    if (accountType !== 'doctor' && accountType !== 'admin') {
      throw new ForbiddenException(
        'Permission denied. Only doctors can execute this operation.',
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
}
