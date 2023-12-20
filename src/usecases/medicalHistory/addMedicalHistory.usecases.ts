import { ILogger } from 'src/domain/logger/logger.interface';
import { MedicalHistoryModel } from 'src/domain/model/medicalHistoryModel';
import { MedicalHistoryRepository } from 'src/domain/repositories/medicalHistory.repository.interface';

export class addMedicalHistoryUseCases {
  constructor(
    private readonly logger: ILogger,
    private readonly medicalHistoryRepository: MedicalHistoryRepository,
  ) {}
  async execute(data: MedicalHistoryModel): Promise<MedicalHistoryModel> {
    const medicalHistory = new MedicalHistoryModel();
    medicalHistory.id = data.id;
    medicalHistory.patientId = data.patientId;
    const result =
      await this.medicalHistoryRepository.createMedicalHistory(medicalHistory);
    this.logger.log(
      'addMedicalHistoryUseCases execute',
      'New MedicalHistory have been inserted',
    );
    return result;
  }
}
