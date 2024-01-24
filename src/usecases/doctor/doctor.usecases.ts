import { ILogger } from 'src/domain/logger/logger.interface';
import { DoctorRepository } from 'src/domain/repositories/doctor.repository.interface';
import { DoctorModel } from 'src/domain/model/doctorModel';
import { ForbiddenException } from '@nestjs/common';

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
  // async updateDoctorInfo(
  //   data: DoctorModel,
  //   accountDoctor,
  // ): Promise<DoctorModel> {
  //   if (accountDoctor.accountType === 'doctor') {

  //   }
  // }
}
