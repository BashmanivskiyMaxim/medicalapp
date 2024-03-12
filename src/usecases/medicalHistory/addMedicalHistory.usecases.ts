import { ForbiddenException } from '@nestjs/common';
import { ILogger } from 'src/domain/logger/logger.interface';
import { MedicalHistoryModel } from 'src/domain/model/medicalHistoryModel';
import { DoctorRepository } from 'src/domain/repositories/doctor.repository.interface';
import { MedicalHistoryRepository } from 'src/domain/repositories/medicalHistory.repository.interface';
import { PatientRepository } from 'src/domain/repositories/patient.repository.interface';

export class addMedicalHistoryUseCases {
  constructor(
    private readonly logger: ILogger,
    private readonly medicalHistoryRepository: MedicalHistoryRepository,
    private readonly patientRepository: PatientRepository,
    private readonly doctorRepository: DoctorRepository,
  ) {}
  async execute(
    data: MedicalHistoryModel,
    account: any,
  ): Promise<MedicalHistoryModel> {
    this.ensureIsDoctor(account.accountType);
    console.log(account);
    await this.ensureIsExistencePatient(data.patientId, account.id);
    const medicalHistory = new MedicalHistoryModel();
    medicalHistory.patientId = data.patientId;
    medicalHistory.medicalInfo = data.medicalInfo;
    medicalHistory.createdDate = new Date();
    medicalHistory.updatedDate = new Date();
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
  private async ensureIsExistencePatient(patientId: number, accountId: number) {
    const doctor = await this.doctorRepository.findByAccountId(accountId);
    const result = await this.patientRepository.getPatient(
      patientId,
      doctor.id,
    );
    if (!result && !doctor) {
      throw new ForbiddenException(
        'Permission denied. Patient does not exist.',
      );
    }
  }
  private async ensureIsExistenceMedicalHistory(id: number): Promise<any> {
    const result =
      await this.medicalHistoryRepository.getMedicalHistoryById(id);
    if (!result) {
      throw new ForbiddenException(
        'Permission denied. MedicalHistory does not exist.',
      );
    }
    return result;
  }
  async updateMedicalHistory(
    id: number,
    data: MedicalHistoryModel,
    accountDoctor: any,
  ): Promise<MedicalHistoryModel> {
    this.ensureIsDoctor(accountDoctor.accountType);
    await this.ensureIsExistenceMedicalHistory(id);
    const medicalHistory = new MedicalHistoryModel();
    medicalHistory.medicalInfo = data.medicalInfo;
    medicalHistory.patientId = data.patientId;
    medicalHistory.updatedDate = new Date();
    const result = await this.medicalHistoryRepository.updateMedicalHistory(
      id,
      medicalHistory,
    );
    this.logger.log(
      'updateMedicalHistoryUseCases execute',
      'MedicalHistory have been updated',
    );
    return result;
  }

  async deleteMedicalHistory(id: number, accountDoctor: any): Promise<any> {
    this.ensureIsDoctor(accountDoctor.accountType);
    const medicalHistory = await this.ensureIsExistenceMedicalHistory(id);
    await this.ensureIsExistencePatient(
      medicalHistory.patientId,
      accountDoctor.id,
    );
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
