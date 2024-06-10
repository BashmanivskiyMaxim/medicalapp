import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { PatientEntity } from '../entities/patient.entity';
import { PatientRepository } from '../../domain/repositories/patient.repository.interface';
import { PatientModel } from 'src/domain/model/patientModel';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class DatabasePatientRepository
  extends BaseAbstractRepository<PatientEntity>
  implements PatientRepository
{
  constructor(
    @InjectRepository(PatientEntity)
    private readonly patientEntityRepository: Repository<PatientEntity>,
  ) {
    super(patientEntityRepository);
  }
  async encryptAdditionalInfo(
    additionalInfo: any,
    encryptionKey: string,
  ): Promise<any> {
    const encryptedContent = await this.patientEntityRepository.query(
      `SELECT pgp_sym_encrypt($1, $2) AS encrypted_additional_info`,
      [additionalInfo, encryptionKey],
    );
    return encryptedContent[0].encrypted_additional_info;
  }
  async decryptAdditionalInfo(
    encryptedAdditionalInfo: any,
    encryptionKey: string,
  ): Promise<any> {
    const decryptedAdditionalInfo = await this.patientEntityRepository.query(
      `SELECT pgp_sym_decrypt($1, $2) AS decrypted_additional_info`,
      [encryptedAdditionalInfo, encryptionKey],
    );
    return JSON.parse(decryptedAdditionalInfo[0].decrypted_additional_info);
  }
  async createPatient(patient: PatientModel): Promise<any> {
    patient.additional_info = JSON.stringify(patient.additional_info);
    const encryptedAdditionalInfo = await this.encryptAdditionalInfo(
      patient.additional_info,
      process.env.ENCRYPTION_KEY,
    );
    const patientEntity = this.patientEntityRepository.create({
      account: { id: patient.accountId },
      recovery_status: patient.recovery_status,
      additional_info: encryptedAdditionalInfo,
    });
    return this.patientEntityRepository.save(patientEntity);
  }
  async updatePatient(patient: PatientModel): Promise<any> {
    patient.additional_info = JSON.stringify(patient.additional_info);
    const encryptedAdditionalInfo = await this.encryptAdditionalInfo(
      patient.additional_info,
      process.env.ENCRYPTION_KEY,
    );

    const patientEntity: QueryDeepPartialEntity<PatientEntity> = {
      ...patient,
      additional_info: encryptedAdditionalInfo,
    };

    return this.patientEntityRepository.update(patient.id, patientEntity);
  }
  async deletePatient(patientId: number): Promise<any> {
    return await this.patientEntityRepository.delete(patientId);
  }
  async getPatient(accountId: number): Promise<any> {
    const patient = await this.patientEntityRepository.findOne({
      where: { account: { id: accountId } },
      relations: ['account'],
      select: {
        account: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          accountType: true,
          username: true,
          createdate: true,
          last_login: true,
        },
        id: true,
        additional_info: true,
      },
    });

    if (!patient) {
      throw new Error(`Patient with account ID ${accountId} not found`);
    }

    try {
      patient.additional_info = await this.decryptAdditionalInfo(
        patient.additional_info,
        process.env.ENCRYPTION_KEY,
      );
    } catch (error) {
      console.error('Error decrypting additional info:', error);
      throw new Error(
        'Failed to decrypt additional info. Possible wrong key or corrupt data.',
      );
    }

    return patient;
  }

  getPatients(): Promise<any> {
    return this.patientEntityRepository.find();
  }
  getPatientByAccountId(accountId: number): Promise<any> {
    return this.patientEntityRepository.findOne({
      where: { account: { id: accountId } },
    });
  }
  async getPatientById(patientId: number): Promise<any> {
    const patient = await this.patientEntityRepository.findOne({
      where: { id: patientId },
      relations: ['account'],
      select: {
        account: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          accountType: true,
          username: true,
          createdate: true,
          last_login: true,
        },
        id: true,
        additional_info: true,
      },
    });

    if (!patient) {
      throw new Error(`Patient with ID ${patientId} not found`);
    }

    try {
      patient.additional_info = await this.decryptAdditionalInfo(
        patient.additional_info,
        process.env.ENCRYPTION_KEY,
      );
    } catch (error) {
      console.error('Error decrypting additional info:', error);
      throw new Error(
        'Failed to decrypt additional info. Possible wrong key or corrupt data.',
      );
    }

    return patient;
  }
}
