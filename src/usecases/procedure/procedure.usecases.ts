import { ForbiddenException, Logger } from '@nestjs/common';
import {
  ProcedureModel,
  ProcedureModelWithDoctor,
} from 'src/domain/model/procedureModel';
import { DoctorRepository } from 'src/domain/repositories/doctor.repository.interface';
import { ProcedureRepository } from 'src/domain/repositories/procedure.repository';
import { EntityValidator } from '../utils/checkExistense.usecases';

export class addProcedureUseCases {
  constructor(
    private readonly logger: Logger,
    private readonly procedureRepository: ProcedureRepository,
    private readonly EntityValidator: EntityValidator,
    private readonly doctorRepository: DoctorRepository,
  ) {}

  private ensureIsAdmin(accountType: string) {
    if (accountType !== 'admin') {
      throw new ForbiddenException(
        'Permission denied. Only admin can execute this operation.',
      );
    }
  }

  async add(
    data: ProcedureModelWithDoctor,
    accountAdmin: { accountType: string },
  ): Promise<ProcedureModel> {
    this.ensureIsAdmin(accountAdmin.accountType);
    const doctor = await this.doctorRepository.findByUsername(
      data.doctorUsername,
    );
    if (!doctor) {
      throw new ForbiddenException('Doctor not found');
    }
    const procedure = new ProcedureModel();
    procedure.doctorId = doctor.id;
    procedure.procedureName = data.procedureName;
    procedure.procedureDescription = data.procedureDescription;
    procedure.averageRating = 0;
    const result = await this.procedureRepository.createProcedure(procedure);
    this.logger.log(
      'addProcedureUseCases execute',
      'New procedure have been inserted',
    );
    return result;
  }
}
