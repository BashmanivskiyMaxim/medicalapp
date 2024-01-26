import { ILogger } from 'src/domain/logger/logger.interface';
import { DoctorRepository } from 'src/domain/repositories/doctor.repository.interface';
import { DoctorModel } from 'src/domain/model/doctorModel';
import { ForbiddenException } from '@nestjs/common';
import { EntityValidator } from '../utils/checkExistense.usecases';

export class addDoctorUseCases {
  constructor(
    private readonly logger: ILogger,
    private readonly doctorRepository: DoctorRepository,
    private readonly EntityValidator: EntityValidator,
  ) {}

  private ensureIsDoctor(accountType: string) {
    if (accountType !== 'doctor' && accountType !== 'admin') {
      throw new ForbiddenException(
        'Permission denied. Only doctors can execute this operation.',
      );
    }
  }

  async execute(data: DoctorModel, accountDoctor): Promise<DoctorModel> {
    this.ensureIsDoctor(accountDoctor.accountType);
    const doctor = new DoctorModel();
    doctor.accountId = accountDoctor.id;
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
    id: string,
    data: DoctorModel,
    accountDoctor: any,
  ): Promise<DoctorModel> {
    this.ensureIsDoctor(accountDoctor.accountType);
    await this.EntityValidator.existence(accountDoctor.id);
    const doctor = new DoctorModel();
    doctor.specialty = data.specialty;
    doctor.qualification = data.qualification;
    const result = await this.doctorRepository.updateDoctor(+id, doctor);
    this.logger.log(
      'updateDoctorInfoUseCases execute',
      'Doctor info have been updated',
    );
    return result;
  }

  async deleteDoctor(accountDoctor: any): Promise<DoctorModel> {
    this.ensureIsDoctor(accountDoctor.accountType);
    await this.EntityValidator.existence(accountDoctor.id);
    const existingDoctorAccount = await this.doctorRepository.findByAccountId(
      +accountDoctor.id,
    );
    const result = await this.doctorRepository.deleteDoctor(
      +existingDoctorAccount.id,
    );
    this.logger.log(
      'deleteDoctorUseCases execute',
      'Doctor info have been deleted',
    );
    return result;
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
}
