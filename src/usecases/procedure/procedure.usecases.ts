import { ForbiddenException, Logger } from '@nestjs/common';
import {
  ProcedureModel,
  ProcedureModelWithDoctor,
} from 'src/domain/model/procedureModel';
import { DoctorRepository } from 'src/domain/repositories/doctor.repository.interface';
import { ProcedureRepository } from 'src/domain/repositories/procedure.repository';
import { EntityValidator } from '../utils/checkExistense.usecases';
import { PatientProcedureRepository } from 'src/domain/repositories/patientProcedure.repository';

export class addProcedureUseCases {
  constructor(
    private readonly logger: Logger,
    private readonly procedureRepository: ProcedureRepository,
    private readonly entityValidator: EntityValidator,
    private readonly doctorRepository: DoctorRepository,
    private readonly patientProcedureRepository: PatientProcedureRepository,
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

  async add(data: any, account: any): Promise<ProcedureModel> {
    this.ensureIsDoctor(account.accountType);

    console.log('data', data.doctorId);
    const doctor = await this.doctorRepository.getDoctorById(data.doctorId);
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
      'New procedure has been inserted',
    );

    return result;
  }

  async update(
    data: any,
    accountDoctor: any,
    doctorId: number,
    id: string,
  ): Promise<ProcedureModel> {
    this.ensureIsDoctor(accountDoctor.accountType);

    const doctor = await this.doctorRepository.getDoctorById(doctorId);
    if (!doctor) {
      throw new ForbiddenException('Doctor not found');
    }

    const procedure = await this.procedureRepository.getProcedureById(+id);
    if (!procedure || procedure.doctorId !== doctor.id) {
      throw new ForbiddenException('Permission denied');
    }

    procedure.procedureName = data.procedureName;
    procedure.procedureDescription = data.procedureDescription;

    const result = await this.procedureRepository.updateProcedure(
      +id,
      procedure,
    );

    this.logger.log(
      'addProcedureUseCases execute',
      'Procedure has been updated',
    );

    return result;
  }

  async delete(id: string, accountDoctor: any, doctorId: number) {
    this.ensureIsDoctor(accountDoctor.accountType);
    const doctor = await this.doctorRepository.getDoctorById(doctorId);
    if (!doctor) {
      throw new ForbiddenException('Doctor not found');
    }
    const procedure = await this.procedureRepository.getProcedureById(+id);
    if (!procedure || procedure.doctorId !== doctor.id) {
      throw new ForbiddenException('Permission denied');
    }
    await this.procedureRepository.deleteProcedure(+id);
    this.logger.log(
      'addProcedureUseCases execute',
      'Procedure has been marked as deleted',
    );
  }

  async getById(id: string) {
    const procedure = await this.procedureRepository.getProcedureById(+id);
    if (!procedure || procedure.deleted) {
      throw new ForbiddenException('Procedure not found');
    }
    this.logger.log(
      'addProcedureUseCases execute',
      'Procedure has been fetched',
    );
    return procedure;
  }

  async getAll(): Promise<ProcedureModel[]> {
    const procedures = await this.procedureRepository.findForAll({
      where: { deleted: false },
      relations: ['doctor'],
    });

    if (!procedures) {
      throw new ForbiddenException('Procedures not found');
    }

    this.logger.log(
      'addProcedureUseCases execute',
      'All procedures have been fetched',
    );

    return procedures;
  }

  async getProceduresWithDoctor(
    procedures: any,
  ): Promise<ProcedureModelWithDoctor[]> {
    const doctorIds = procedures.map((proc) => proc.doctor?.id).filter(Boolean);

    const doctors = await this.doctorRepository.getDoctorsByIds(doctorIds);

    if (!doctors || doctors.length === 0) {
      throw new ForbiddenException('Doctors not found');
    }

    const doctorMap = new Map(doctors.map((doc) => [doc.id, doc]));

    const proceduresWithDoctor: ProcedureModelWithDoctor[] = procedures.map(
      (proc) => {
        const doctor = doctorMap.get(proc.doctor.id);
        if (!doctor) {
          throw new ForbiddenException(
            `Doctor with ID ${proc.doctor.id} not found`,
          );
        }

        return {
          id: proc.id,
          procedureName: proc.procedureName,
          procedureDescription: proc.procedureDescription,
          averageRating: proc.averageRating,
          doctor: doctor,
        };
      },
    );

    this.logger.log(
      'addProcedureUseCases execute',
      'All procedures with doctors have been fetched',
    );

    return proceduresWithDoctor;
  }

  async rate(id: string, accountAdmin: { accountType: string }) {
    this.ensureIsAdmin(accountAdmin.accountType);
    const procedure = await this.procedureRepository.getProcedureById(+id);
    if (!procedure || procedure.deleted) {
      throw new ForbiddenException('Procedure not found');
    }
    const procedures =
      await this.patientProcedureRepository.getPatientProceduresByProcedureId(
        +id,
      );
    if (!procedures) {
      throw new ForbiddenException('Patient Procedures not found');
    }
    let rate = 0;
    for (const proc of procedures) {
      rate += proc.rating;
    }
    procedure.averageRating = Math.round(rate / procedures.length);
    const result = await this.procedureRepository.updateProcedure(
      +id,
      procedure,
    );
    this.logger.log('addProcedureUseCases execute', 'Procedure has been rated');
    return result;
  }

  async getDoctorProcedures(account: any) {
    const doctors = await this.doctorRepository.findByAccountId(account.id);

    if (!doctors || doctors.length === 0) {
      throw new ForbiddenException('Doctors not found');
    }

    let allProcedures = [];

    for (const doctor of doctors) {
      const procedures = await this.procedureRepository.getProceduresByDoctorId(
        +doctor.id,
      );
      if (procedures) {
        allProcedures = allProcedures.concat(procedures);
      }
    }

    if (allProcedures.length === 0) {
      throw new ForbiddenException('Procedures not found');
    }

    this.logger.log(
      'addProcedureUseCases execute',
      'All doctor procedures have been fetched',
    );

    return allProcedures;
  }
}
