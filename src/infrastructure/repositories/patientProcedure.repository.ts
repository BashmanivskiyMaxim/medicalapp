import { PatientProcedureRepository } from 'src/domain/repositories/patientProcedure.repository';
import { PatientProcedureEntity } from '../entities/patientProcedure.entity';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PatientProcedureModel } from 'src/domain/model/patientProcedureModel';
import { Brackets } from 'typeorm';

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
    const patientProcedures = await this.patientProcedureEntityRepository
      .createQueryBuilder('patientProcedure')
      .leftJoinAndSelect('patientProcedure.doctor', 'doctor')
      .leftJoinAndSelect('doctor.account', 'account')
      .leftJoinAndSelect('patientProcedure.procedure', 'procedure')
      .where('patientProcedure.patientId = :patientId', { patientId })
      .select([
        'patientProcedure',
        'doctor.specialty',
        'doctor.qualification',
        'account.email',
        'account.firstName',
        'account.lastName',
        'procedure.id',
        'procedure.procedureName',
        'procedure.procedureDescription',
      ])
      .getMany();
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
    console.log('Patient Procedure:', patientProcedureId);
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
  async getPastProceduresByDoctorId(
    doctorId: number,
    page: number,
    pageSize: number,
  ): Promise<{ data: any[]; total: number }> {
    const today = new Date();
    const [patientProcedures, total] =
      await this.patientProcedureEntityRepository
        .createQueryBuilder('patientProcedure')
        .leftJoinAndSelect('patientProcedure.patient', 'patient')
        .leftJoinAndSelect('patient.account', 'patientAccount')
        .leftJoinAndSelect('patientProcedure.procedure', 'procedure')
        .where('patientProcedure.doctorId = :doctorId', { doctorId })
        .andWhere('patientProcedure.procedureDate < :today', { today })
        .andWhere(
          'patientProcedure.patientId NOT IN (:...excludedPatientIds)',
          { excludedPatientIds: [28, 29] },
        )
        .select([
          'patientProcedure',
          'patient.id',
          'patientAccount.email',
          'patientAccount.firstName',
          'patientAccount.lastName',
          'procedure.id',
          'procedure.procedureName',
          'procedure.procedureDescription',
        ])
        .skip((page - 1) * pageSize)
        .take(pageSize)
        .getManyAndCount();

    const decryptedReports = await Promise.all(
      patientProcedures.map(async (patientProcedure) => {
        patientProcedure.report = await this.decryptReport(
          patientProcedure.report,
          process.env.ENCRYPTION_KEY,
        );
        return patientProcedure;
      }),
    );

    return { data: decryptedReports, total };
  }

  async searchProceduresByKeyWord(
    keyword: string,
    accountId: number,
    accountType: 'patient' | 'doctor',
  ): Promise<[any[], number]> {
    const queryBuilder = this.patientProcedureEntityRepository
      .createQueryBuilder('patientProcedure')
      .leftJoinAndSelect('patientProcedure.patient', 'patient')
      .leftJoinAndSelect('patient.account', 'patientAccount')
      .leftJoinAndSelect('patientProcedure.procedure', 'procedure')
      .select([
        'patientProcedure',
        'patient.id',
        'patientAccount.email',
        'patientAccount.firstName',
        'patientAccount.lastName',
        'procedure.id',
        'procedure.procedureName',
        'procedure.procedureDescription',
      ]);

    queryBuilder.where(
      new Brackets((qb) => {
        qb.where('procedure.procedureName LIKE :keyword', {
          keyword: `%${keyword}%`,
        })
          .orWhere('procedure.procedureDescription LIKE :keyword', {
            keyword: `%${keyword}%`,
          })
          .orWhere('patientAccount.firstName LIKE :keyword', {
            keyword: `%${keyword}%`,
          })
          .orWhere('patientAccount.lastName LIKE :keyword', {
            keyword: `%${keyword}%`,
          })
          .orWhere('patientAccount.email LIKE :keyword', {
            keyword: `%${keyword}%`,
          });
      }),
    );

    if (accountType === 'patient') {
      queryBuilder.andWhere('patient.id = :accountId', { accountId });
      queryBuilder.andWhere(
        'patientProcedure.patientId NOT IN (:...excludedPatientIds)',
        {
          excludedPatientIds: [28, 29],
        },
      );
    } else if (accountType === 'doctor') {
      queryBuilder.andWhere('patientProcedure.doctorId = :accountId', {
        accountId,
      });
      queryBuilder.andWhere(
        'patientProcedure.patientId NOT IN (:...excludedPatientIds)',
        {
          excludedPatientIds: [28, 29],
        },
      );
    }

    const [result, total] = await queryBuilder.getManyAndCount();

    let decryptedReports = [];
    if (result.length > 0) {
      decryptedReports = await Promise.all(
        result.map(async (patientProcedure) => {
          if (patientProcedure.report) {
            try {
              patientProcedure.report = await this.decryptReport(
                patientProcedure.report,
                process.env.ENCRYPTION_KEY,
              );
            } catch (error) {
              console.error('Error decrypting report:', error);
              throw error;
            }
          }
          return patientProcedure;
        }),
      );
    }

    return [decryptedReports, total];
  }
  async getTodayProceduresByDoctorId(
    doctorId: number,
    page: number,
    pageSize: number,
  ): Promise<{ data: any[]; total: number }> {
    const today = new Date().toISOString().split('T')[0];
    const [patientProcedures, total] =
      await this.patientProcedureEntityRepository
        .createQueryBuilder('patientProcedure')
        .leftJoinAndSelect('patientProcedure.patient', 'patient')
        .leftJoinAndSelect('patient.account', 'patientAccount')
        .leftJoinAndSelect('patientProcedure.procedure', 'procedure')
        .where('patientProcedure.doctorId = :doctorId', { doctorId })
        .andWhere('DATE(patientProcedure.procedureDate) = :today', { today })
        .andWhere(
          'patientProcedure.patientId NOT IN (:...excludedPatientIds)',
          { excludedPatientIds: [28, 29] },
        )
        .select([
          'patientProcedure',
          'patient.id',
          'patientAccount.email',
          'patientAccount.firstName',
          'patientAccount.lastName',
          'procedure.id',
          'procedure.procedureName',
          'procedure.procedureDescription',
        ])
        .skip((page - 1) * pageSize)
        .take(pageSize)
        .getManyAndCount();

    const decryptedReports = await Promise.all(
      patientProcedures.map(async (patientProcedure) => {
        patientProcedure.report = await this.decryptReport(
          patientProcedure.report,
          process.env.ENCRYPTION_KEY,
        );
        return patientProcedure;
      }),
    );

    return { data: decryptedReports, total };
  }

  async getFutureProceduresByDoctorId(
    doctorId: number,
    page: number,
    pageSize: number,
  ): Promise<{ data: any[]; total: number }> {
    const today = new Date();
    const [patientProcedures, total] =
      await this.patientProcedureEntityRepository
        .createQueryBuilder('patientProcedure')
        .leftJoinAndSelect('patientProcedure.patient', 'patient')
        .leftJoinAndSelect('patient.account', 'patientAccount')
        .leftJoinAndSelect('patientProcedure.procedure', 'procedure')
        .where('patientProcedure.doctorId = :doctorId', { doctorId })
        .andWhere('patientProcedure.procedureDate > :today', { today })
        .andWhere(
          'patientProcedure.patientId NOT IN (:...excludedPatientIds)',
          { excludedPatientIds: [28, 29] },
        )
        .select([
          'patientProcedure',
          'patient.id',
          'patientAccount.email',
          'patientAccount.firstName',
          'patientAccount.lastName',
          'procedure.id',
          'procedure.procedureName',
          'procedure.procedureDescription',
        ])
        .skip((page - 1) * pageSize)
        .take(pageSize)
        .getManyAndCount();

    const decryptedReports = await Promise.all(
      patientProcedures.map(async (patientProcedure) => {
        patientProcedure.report = await this.decryptReport(
          patientProcedure.report,
          process.env.ENCRYPTION_KEY,
        );
        return patientProcedure;
      }),
    );

    return { data: decryptedReports, total };
  }

  async getPatientProceduresTimesByDate(
    date: string,
    procedureId: number,
  ): Promise<PatientProcedureModel[]> {
    const formattedDate = new Date(date).toISOString().split('T')[0];

    const patientProcedures = await this.patientProcedureEntityRepository
      .createQueryBuilder('patientProcedure')
      .where('patientProcedure.procedureId = :procedureId', { procedureId })
      .andWhere('patientProcedure.patientId = :patientId', { patientId: 28 })
      .andWhere('DATE(patientProcedure.procedureDate) = DATE(:formattedDate)', {
        formattedDate,
      })
      .select([
        'patientProcedure.id',
        'patientProcedure.appointmentTime',
        'patientProcedure.procedureDate',
      ])
      .getMany();

    return patientProcedures;
  }
  async getExistenseProcTodayByPatientId(
    patientId: number,
    procedureDate: string,
    //procedureId: number,
  ): Promise<any> {
    const date = new Date(procedureDate).toISOString().split('T')[0];

    return (
      this.patientProcedureEntityRepository
        .createQueryBuilder('procedure')
        .where('procedure.patientId = :patientId', { patientId })
        //.andWhere('procedure.procedureId = :procedureId', { procedureId })
        .andWhere('DATE(procedure.procedureDate) = :date', { date })
        .getOne()
    );
  }

  async deleteSchedule(startOfDay: Date, endOfDay: Date) {
    await this.patientProcedureEntityRepository
      .createQueryBuilder()
      .delete()
      .from(PatientProcedureEntity)
      .where('patientId = :patientId', { patientId: 28 })
      .andWhere('procedureDate BETWEEN :startOfDay AND :endOfDay', {
        startOfDay,
        endOfDay,
      })
      .execute();
  }

  async getExistenseProcedure(
    procedure: any,
    procedureDate,
    appointmentTime,
  ): Promise<any> {
    return await this.patientProcedureEntityRepository.findOne({
      where: {
        doctorId: procedure.doctorId,
        patientId: 28,
        procedureId: procedure.id,
        procedureDate: procedureDate,
        appointmentTime: appointmentTime,
      },
    });
  }
  async getAvailableProceduresByDay(todayDate: string): Promise<any> {
    return this.patientProcedureEntityRepository
      .createQueryBuilder('patientProcedure')
      .leftJoinAndSelect('patientProcedure.procedure', 'procedure')
      .where('DATE(patientProcedure.procedureDate) = DATE(:todayDate)', {
        todayDate,
      })
      .andWhere('patientProcedure.patientId = :patientId', { patientId: 28 })
      .select([
        'patientProcedure.id',
        'patientProcedure.procedureDate',
        'patientProcedure.appointmentTime',
        'procedure.id',
        'procedure.procedureName',
        'procedure.procedureDescription',
      ])
      .getMany();
  }
  async getUserPreferences(patientId: number): Promise<any> {
    return await this.patientProcedureEntityRepository.find({
      where: { patientId },
    });
  }
  async getProceduresByDoctorAndTime(
    doctorId: number,
    appointmentTime: string,
    procedureDate: string,
  ): Promise<PatientProcedureModel[]> {
    const date = new Date(procedureDate).toISOString().split('T')[0];

    return this.patientProcedureEntityRepository
      .createQueryBuilder('procedure')
      .where('procedure.doctorId = :doctorId', { doctorId })
      .andWhere('procedure.appointmentTime = :appointmentTime', {
        appointmentTime,
      })
      .andWhere('DATE(procedure.procedureDate) = :date', { date })
      .getMany();
  }

  async getInactiveProceduresByDoctorAndTime(
    doctorId: number,
    appointmentTime: string,
    procedureDate: string,
  ): Promise<PatientProcedureModel[]> {
    const date = new Date(procedureDate).toISOString().split('T')[0];
    return this.patientProcedureEntityRepository
      .createQueryBuilder('procedure')
      .where('procedure.doctorId = :doctorId', { doctorId })
      .andWhere('procedure.appointmentTime = :appointmentTime', {
        appointmentTime,
      })
      .andWhere('DATE(procedure.procedureDate) = :date', { date })
      .andWhere('procedure.patientId = 29')
      .getMany();
  }

  async getTodayPatientProcedures(patientId: number): Promise<any> {
    const today = new Date().toISOString().split('T')[0];
    return this.patientProcedureEntityRepository
      .createQueryBuilder('patientProcedure')
      .leftJoinAndSelect('patientProcedure.procedure', 'procedure')
      .where('patientProcedure.patientId = :patientId', { patientId })
      .andWhere('DATE(patientProcedure.procedureDate) = DATE(:today)', {
        today,
      })
      .select([
        'patientProcedure',
        'procedure.id',
        'procedure.procedureName',
        'procedure.procedureDescription',
      ])
      .getMany();
  }
}
