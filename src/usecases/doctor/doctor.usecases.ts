import { ILogger } from '../../domain/logger/logger.interface';
import { DoctorRepository } from '../../domain/repositories/doctor.repository.interface';
import { DoctorModel } from '../../domain/model/doctorModel';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { EntityValidator } from '../utils/checkExistense.usecases';
import { AccountRepository } from 'src/domain/repositories/account.repository.interface';

export class addDoctorUseCases {
  constructor(
    private readonly logger: ILogger,
    private readonly doctorRepository: DoctorRepository,
    private readonly EntityValidator: EntityValidator,
    private readonly accountRepository: AccountRepository,
  ) {}

  private ensureIsDoctor(accountType: string) {
    if (accountType !== 'doctor' && accountType !== 'admin') {
      throw new ForbiddenException(
        'Permission denied. Only doctors can execute this operation.',
      );
    }
  }

  private ensureIsAdmin(accountType: string) {
    if (accountType !== 'admin') {
      throw new ForbiddenException(
        'Permission denied. Only admin can execute this operation.',
      );
    }
  }

  async execute(data: DoctorModel, accountAdmin): Promise<DoctorModel> {
    this.ensureIsAdmin(accountAdmin.accountType);

    await this.accountRepository.changeAccountType(
      data.accountId.toString(),
      'doctor',
    );
    const doctor = new DoctorModel();
    doctor.accountId = data.accountId;
    doctor.specialty = data.specialty;
    doctor.qualification = data.qualification;
    const result = await this.doctorRepository.createDoctor(doctor);
    this.logger.log(
      'addDoctorUseCases execute',
      'New apointment have been inserted',
    );
    return result;
  }

  async updateDoctorInfo(
    id: number,
    data: any,
    accountDoctor: any,
  ): Promise<DoctorModel> {
    this.ensureIsDoctor(accountDoctor.accountType);
    await this.EntityValidator.existence(accountDoctor.id);
    const doctor = new DoctorModel();
    doctor.specialty = data.specialty;
    doctor.qualification = data.qualification;
    const result = await this.doctorRepository.updateDoctor(id, doctor);
    this.logger.log(
      'updateDoctorInfoUseCases execute',
      'Doctor info have been updated',
    );
    return result;
  }

  async deleteDoctor(doctorId: string, accountAdmin: any): Promise<any> {
    this.ensureIsAdmin(accountAdmin.accountType);
    await this.EntityValidator.existence(doctorId);
    const doctor = await this.doctorRepository.getDoctorById(+doctorId);
    console.log('doctor', doctor);
    await this.accountRepository.changeAccountType(
      doctor.account.id.toString(),
      'user',
    );
    //await this.doctorRepository.deleteDoctor(+doctorId);
    this.logger.log('deleteDoctorUseCases execute', 'Doctor have been deleted');
    return doctor;
  }

  async getDoctors(accountType: string): Promise<DoctorModel> {
    this.ensureIsDoctor(accountType);
    const Doctors = await this.doctorRepository.getDoctors();
    this.logger.log(
      'getDoctorsUseCases execute',
      'Doctors have been retrieved',
    );
    return Doctors;
  }

  async getMyDoctorInfo(accountDoctor: any): Promise<DoctorModel[]> {
    this.ensureIsDoctor(accountDoctor.accountType);
    await this.EntityValidator.existence(accountDoctor.id);

    const doctors = await this.doctorRepository.findByAccountId(
      accountDoctor.id,
    );
    if (!doctors || doctors.length === 0) {
      throw new NotFoundException('Doctors not found');
    }

    this.logger.log(
      'getMyDoctorInfoUseCases execute',
      'Doctor info has been retrieved',
    );

    return doctors;
  }

  async getDoctorsByAccount(accountDoctor: any): Promise<DoctorModel> {
    this.ensureIsDoctor(accountDoctor.accountType);
    await this.EntityValidator.existence(accountDoctor.id);
    const doctors = await this.doctorRepository.findAllDoctorsByAccountId(
      accountDoctor.id,
    );
    this.logger.log(
      'getDoctorsByAccountUseCases execute',
      'Doctors have been retrieved',
    );
    return doctors;
  }
}
