import { ILogger } from 'src/domain/logger/logger.interface';
import { PatientRepository } from 'src/domain/repositories/patient.repository.interface';
import { PatientModel } from 'src/domain/model/patientModel';

export class addPatientUseCases {
  constructor(
    private readonly logger: ILogger,
    private readonly patientRepository: PatientRepository,
  ) {}
  async execute(data: PatientModel): Promise<PatientModel> {
    const patient = new PatientModel();
    patient.id = data.id;
    patient.accountId = data.accountId;
    patient.doctorId = data.doctorId;
    const result = await this.patientRepository.createPatient(patient);
    this.logger.log(
      'addPatientUseCases execute',
      'New patient have been inserted',
    );
    return result;
  }
}
