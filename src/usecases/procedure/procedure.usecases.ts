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

  private ensureIsDoctor(accountType: string) {
    if (accountType !== 'doctor' && accountType !== 'admin') {
      throw new ForbiddenException(
        'Permission denied. Only doctors or admin can execute this operation.',
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

  async update(
    data: ProcedureModelWithDoctor,
    accountAdmin: { accountType: string },
    id: string,
  ): Promise<ProcedureModel> {
    this.ensureIsDoctor(accountAdmin.accountType);
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
    const result = await this.procedureRepository.updateProcedure(
      +id,
      procedure,
    );
    this.logger.log(
      'addProcedureUseCases execute',
      'Procedure have been updated',
    );
    return result;
  }

  async delete(id: string, accountAdmin: { accountType: string }) {
    this.ensureIsAdmin(accountAdmin.accountType);
    await this.procedureRepository.deleteProcedure(+id);
    this.logger.log(
      'addProcedureUseCases execute',
      'Procedure have been deleted',
    );
  }

  async getById(id: string) {
    const procedure = await this.procedureRepository.getProcedureById(+id);
    if (!procedure) {
      throw new ForbiddenException('Procedure not found');
    }
    this.logger.log(
      'addProcedureUseCases execute',
      'Procedure have been fetched',
    );
    return procedure;
  }

  async getAll() {
    const procedures = await this.procedureRepository.getProcedures();
    this.logger.log(
      'addProcedureUseCases execute',
      'All procedures have been fetched',
    );
    return procedures;
  }

  // async rate(id: string, accountAdmin: { accountType: string }) {
  //   this.ensureIsAdmin(accountAdmin.accountType);
  //   const procedure = await this.procedureRepository.getProcedureById(+id);
  //   if (!procedure) {
  //     throw new ForbiddenException('Procedure not found');
  //   }
  //   const rates = await this.patientProcedure
  //   procedure.averageRating = rate;
  //   const result = await this.procedureRepository.updateProcedure(+id, procedure);
  //   this.logger.log(
  //     'addProcedureUseCases execute',
  //     'Procedure have been rated',
  //   );
  //   return result;
  // }
}
