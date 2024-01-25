import { ILogger } from 'src/domain/logger/logger.interface';
import { DoctorRepository } from 'src/domain/repositories/doctor.repository.interface';
import { DoctorModel } from 'src/domain/model/doctorModel';
import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

export class addDoctorUseCases {
  constructor(
    private readonly logger: ILogger,
    private readonly doctorRepository: DoctorRepository,
  ) {}
  async execute(data: DoctorModel, accountDoctor): Promise<DoctorModel> {
    if (accountDoctor.accountType === 'doctor') {
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
    } else {
      throw new ForbiddenException(
        'Permission denied. Only doctors can execute this operation.',
      );
    }
  }

  async checkExistence(
    account_id: string,
    throwErrorIfExists: boolean = false,
  ) {
    const existingContactNumberAccount =
      await this.doctorRepository.findDoctorByAccountId(+account_id);

    if (existingContactNumberAccount && throwErrorIfExists) {
      throw new ConflictException(
        'Contact info for this account already exists',
      );
    }

    if (!existingContactNumberAccount && !throwErrorIfExists) {
      throw new NotFoundException(
        'Contact info for this account does not exist',
      );
    }
  }
  async updateDoctorInfo(
    data: DoctorModel,
    account_id: string,
  ): Promise<DoctorModel> {
    const doctor = new DoctorModel();
    doctor.specialty = data.specialty;
    doctor.qualification = data.qualification;
    const result = await this.doctorRepository.updateDoctor(
      doctor,
      +account_id,
    );
    this.logger.log(
      'updateDoctorInfoUseCases execute',
      'Doctor info have been updated',
    );
    return result;
  }
}
