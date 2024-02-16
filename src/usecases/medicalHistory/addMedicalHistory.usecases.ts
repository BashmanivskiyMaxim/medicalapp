import { ForbiddenException } from '@nestjs/common';
import { ILogger } from 'src/domain/logger/logger.interface';
import { MedicalHistoryModel } from 'src/domain/model/medicalHistoryModel';
import { MedicalHistoryRepository } from 'src/domain/repositories/medicalHistory.repository.interface';

export class addMedicalHistoryUseCases {
  constructor(
    private readonly logger: ILogger,
    private readonly medicalHistoryRepository: MedicalHistoryRepository,
  ) {}
  async execute(
    data: MedicalHistoryModel,
    account: any,
  ): Promise<MedicalHistoryModel> {
    this.ensureIsDoctor(account.accountType);
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
  private ensureIsDoctor(accountType: string) {
    if (accountType !== 'doctor' && accountType !== 'admin') {
      throw new ForbiddenException(
        'Permission denied. Only doctors can execute this operation.',
      );
    }
  }
  async updateMedicalHistory(
    id: number,
    data: MedicalHistoryModel,
    account: any,
  ): Promise<MedicalHistoryModel> {
    if (account.accountType !== 'doctor' && account.accountType !== 'admin') {
      throw new Error(
        'Permission denied. Only doctors can execute this operation.',
      );
    }
    const medicalHistory = new MedicalHistoryModel();
    medicalHistory.id = data.id;
    medicalHistory.patientId = data.patientId;
    const result =
      await this.medicalHistoryRepository.updateMedicalHistory(medicalHistory);
    this.logger.log(
      'updateMedicalHistoryUseCases execute',
      'MedicalHistory have been updated',
    );
    return result;
  }

  async deleteMedicalHistory(id: number, accountDoctor: any): Promise<any> {
    this.ensureIsDoctor(accountDoctor.accountType);
    const result = await this.medicalHistoryRepository.deleteMedicalHistory(id);
    this.logger.log(
      'deleteMedicalHistoryUseCases execute',
      'MedicalHistory have been deleted',
    );
    return result;
  }

  async getAllMedicalHistory(account: any): Promise<MedicalHistoryModel[]> {
    if (account.accountType !== 'admin') {
      throw new Error(
        'Permission denied. Only admin can execute this operation.',
      );
    }
    const result = await this.medicalHistoryRepository.getMedicalHistory();
    this.logger.log(
      'getMedicalHistoryUseCases execute',
      'MedicalHistory have been fetched',
    );
    return result;
  }

  async getMedicalHistoryById(
    id: number,
    account: any,
  ): Promise<MedicalHistoryModel> {
    if (account.accountType !== 'patient') {
      throw new Error(
        'Permission denied. Only patient can execute this operation.',
      );
    }
    const result =
      await this.medicalHistoryRepository.getMedicalHistoryById(id);
    this.logger.log(
      'getMedicalHistoryByIdUseCases execute',
      'MedicalHistory have been fetched',
    );
    return result;
  }
}
