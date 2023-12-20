import { ILogger } from 'src/domain/logger/logger.interface';
import { MedicalProcedureModel } from 'src/domain/model/medicalProcedureModel';
import { MedicalProcedureRepository } from 'src/domain/repositories/medicalProcedure.repository.interface';

export class addMedicalProcedureUseCases {
  constructor(
    private readonly logger: ILogger,
    private readonly medicalProcedureRepository: MedicalProcedureRepository,
  ) {}
  async execute(data: MedicalProcedureModel): Promise<MedicalProcedureModel> {
    const medicalProcedure = new MedicalProcedureModel();
    medicalProcedure.id = data.id;
    medicalProcedure.procedureType = data.procedureType;
    medicalProcedure.description = data.description;
    const result =
      await this.medicalProcedureRepository.createMedicalProcedure(
        medicalProcedure,
      );
    this.logger.log(
      'addMedicalProcedureUseCases execute',
      'New MedicalProcedure have been inserted',
    );
    return result;
  }
}
