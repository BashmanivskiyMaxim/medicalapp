import {
  ProcedureModel,
  ProcedureModelWithDoctor,
} from 'src/domain/model/procedureModel';
import { ProcedureEntity } from '../entities/procedure.entity';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProcedureRepository } from 'src/domain/repositories/procedure.repository';

export class DatabaseProcedureRepository
  extends BaseAbstractRepository<ProcedureEntity>
  implements ProcedureRepository
{
  constructor(
    @InjectRepository(ProcedureEntity)
    private readonly procedureEntityRepository: Repository<ProcedureEntity>,
  ) {
    super(procedureEntityRepository);
  }
  createProcedure(procedure: ProcedureModel): Promise<any> {
    const procedureEntity = this.procedureEntityRepository.create({
      doctor: { id: procedure.doctorId },
      procedureName: procedure.procedureName,
      procedureDescription: procedure.procedureDescription,
      averageRating: 0,
    });
    return this.procedureEntityRepository.save(procedureEntity);
  }
  async updateProcedure(id: number, procedure: ProcedureModel): Promise<any> {
    return this.procedureEntityRepository.save({
      id: id,
      ...procedure,
    });
  }
  deleteProcedure(procedureId: number): Promise<any> {
    return this.procedureEntityRepository.delete(procedureId);
  }
  async getProcedure(procedureId: number): Promise<any> {
    return await this.procedureEntityRepository.findOne({
      where: { id: procedureId },
    });
  }
  async getProcedures(): Promise<any> {
    return await this.procedureEntityRepository.find();
  }

  async getProcedureByDoctorId(doctorId: number): Promise<any> {
    return await this.procedureEntityRepository.find({
      where: { doctor: { id: doctorId } },
    });
  }

  async getProcedureByProcedureName(procedureName: string): Promise<any> {
    return await this.procedureEntityRepository.find({
      where: { procedureName: procedureName },
    });
  }

  async getProcedureById(id: number): Promise<any> {
    return await this.procedureEntityRepository.findOne({
      where: { id: id },
    });
  }

  async getDoctorByProcedureId(procedureId: number): Promise<any> {
    return await this.procedureEntityRepository.findOne({
      where: { id: procedureId },
      relations: ['doctor'],
    });
  }

  async getProceduresWithDoctors(): Promise<ProcedureModelWithDoctor[]> {
    const query = `
      SELECT p.id, p.procedure_name, p.procedure_description, p.average_rating, 
             d.id AS doctor_id, d.specialty, d.qualification, d.account_id
      FROM public.procedure p
      JOIN public.doctor d ON p.doctor_id = d.id
    `;

    const result = await this.procedureEntityRepository.query(query);

    return result.map((row) => ({
      id: row.id,
      procedureName: row.procedure_name,
      procedureDescription: row.procedure_description,
      averageRating: row.average_rating,
      doctor: {
        id: row.doctor_id,
        name: row.doctor_name,
        specialization: row.specialization,
      },
    }));
  }
  async findForAll(options: any): Promise<any> {
    return await this.procedureEntityRepository.find(options);
  }
}
