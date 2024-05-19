import { PatientProcedureRepository } from 'src/domain/repositories/patientProcedure.repository';
import { PatientProcedureEntity } from '../entities/patientProcedure.entity';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PatientProcedureModel } from 'src/domain/model/patientProcedureModel';

export class DatabasePatientProcedureRepository
  extends BaseAbstractRepository<PatientProcedureEntity>
  implements PatientProcedureRepository
{
  constructor(
    @InjectRepository(PatientProcedureEntity)
    private readonly patientProcedureEntityRepository: Repository<PatientProcedureEntity>,
  ) {
    super(patientProcedureEntityRepository);
  }
  async encryptReport(report: any, encryptionKey: string): Promise<any> {
    const encryptedContent = await this.patientProcedureEntityRepository.query(
      `SELECT pgp_sym_encrypt($1, $2) AS encrypted_report`,
      [report, encryptionKey],
    );
    return encryptedContent[0].encrypted_report;
  }
  async decryptReport(
    encryptedReport: any,
    encryptionKey: string,
  ): Promise<any> {
    const decryptedReport = await this.patientProcedureEntityRepository.query(
      `SELECT pgp_sym_decrypt($1, $2) AS decrypted_report`,
      [encryptedReport, encryptionKey],
    );
    return JSON.parse(decryptedReport[0].decrypted_report);
  }
  async createPatientProcedure(
    patientProcedure: PatientProcedureModel,
  ): Promise<any> {
    patientProcedure.report = JSON.stringify(patientProcedure.report);
    const encryptedReport = await this.encryptReport(
      patientProcedure.report,
      process.env.ENCRYPTION_KEY,
    );
    const patientProcedureEntity = this.patientProcedureEntityRepository.create(
      {
        patient: { id: patientProcedure.patientId },
        procedure: { id: patientProcedure.procedureId },
        doctor: { id: patientProcedure.doctorId },
        procedureDate: patientProcedure.procedureDate,
        createdDate: patientProcedure.createdDate,
        updatedDate: patientProcedure.updatedDate,
        appointmentTime: patientProcedure.appointmentTime,
        report: encryptedReport,
        rating: patientProcedure.rating,
      },
    );
    return this.patientProcedureEntityRepository.save(patientProcedureEntity);
  }
  async updatePatientProcedure(
    id: number,
    patientProcedure: any,
  ): Promise<any> {
    patientProcedure.report = JSON.stringify(patientProcedure.report);
    const encryptedReport = await this.encryptReport(
      patientProcedure.report,
      process.env.ENCRYPTION_KEY,
    );
    patientProcedure.report = encryptedReport;
    return this.patientProcedureEntityRepository.update(id, patientProcedure);
  }
  async deletePatientProcedure(patientProcedureId: number): Promise<any> {
    return await this.patientProcedureEntityRepository.delete(
      patientProcedureId,
    );
  }
  async getPatientProcedure(patientId: number, doctorId: number): Promise<any> {
    return await this.patientProcedureEntityRepository.findOne({
      where: { id: patientId, doctor: { id: doctorId } },
    });
  }
  async getPatientProcedures(patientId: number): Promise<any> {
    const patientProcedures = await this.patientProcedureEntityRepository.find({
      where: { patient: { id: patientId } },
    });
    for (const patientProcedure of patientProcedures) {
      patientProcedure.report = await this.decryptReport(
        patientProcedure.report,
        process.env.ENCRYPTION_KEY,
      );
    }
    return patientProcedures;
  }
  async getPatientProcedureById(patientProcedureId: number): Promise<any> {
    const patientProcedure =
      await this.patientProcedureEntityRepository.findOne({
        where: { id: patientProcedureId },
      });
    patientProcedure.report = await this.decryptReport(
      patientProcedure.report,
      process.env.ENCRYPTION_KEY,
    );
    return patientProcedure;
  }
  getAllProcedures(): Promise<any> {
    return this.patientProcedureEntityRepository.find();
  }
  getPatientProceduresByProcedureId(procedureId: number): Promise<any> {
    return this.patientProcedureEntityRepository.find({
      where: { procedure: { id: procedureId } },
    });
  }
  async getPatientProceduresByDoctorId(doctorId: number): Promise<any> {
    const patientProcedures = await this.patientProcedureEntityRepository.find({
      where: { doctor: { id: doctorId } },
    });
    for (const patientProcedure of patientProcedures) {
      patientProcedure.report = await this.decryptReport(
        patientProcedure.report,
        process.env.ENCRYPTION_KEY,
      );
    }
    return patientProcedures;
  }
  async getPatientProceduresTimesTodayById(
    date: Date,
    procedureId: number,
  ): Promise<any> {
    const todayDate = date.toISOString().split('T')[0];

    const patientProcedures = await this.patientProcedureEntityRepository
      .createQueryBuilder('patientProcedure')
      .where('patientProcedure.procedureId = :procedureId', { procedureId })
      .andWhere('patientProcedure.patientId = :patientId', { patientId: 28 })
      .andWhere('DATE(patientProcedure.procedureDate) = DATE(:todayDate)', {
        todayDate,
      })
      .getMany();

    return patientProcedures.map((patientProcedure) => ({
      id: patientProcedure.id,
      appointmentTime: patientProcedure.appointmentTime,
    }));
  }
  async getExistenseProcTodayByPatientId(
    patientId: number,
    patientProcedureId: number,
  ): Promise<any> {
    const todayDate = new Date().toISOString().split('T')[0];
    const patientProcedure =
      await this.patientProcedureEntityRepository.findOne({
        where: {
          id: patientProcedureId,
        },
      });
    const patientProcedures = await this.patientProcedureEntityRepository
      .createQueryBuilder('patientProcedure')
      .where('patientProcedure.patientId = :patientId', { patientId })
      .andWhere('DATE(patientProcedure.procedureDate) = DATE(:todayDate)', {
        todayDate,
      })
      .andWhere('patientProcedure.procedureId = :procedureId', {
        procedureId: patientProcedure.procedureId,
      })
      .getOne();
    return patientProcedures;
  }
}
