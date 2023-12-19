import { ILogger } from 'src/domain/logger/logger.interface';
import { DoctorRepository } from 'src/domain/repositories/doctor.repository.interface';
import { DoctorModel } from 'src/domain/model/doctorModel';

export class addDoctorUseCases {
  constructor(
    private readonly logger: ILogger,
    private readonly doctorRepository: DoctorRepository,
  ) {}
  async execute(data: DoctorModel): Promise<DoctorModel> {
    const doctor = new DoctorModel();
    doctor.id = data.id;
    doctor.accountId = data.accountId;
    doctor.specialty = data.specialty;
    doctor.qualification = data.qualification;
    doctor.patients = data.patients;
    const result = await this.doctorRepository.createDoctor(doctor);
    this.logger.log(
      'addDoctorUseCases execute',
      'New apointment have been inserted',
    );
    return result;
  }
}
