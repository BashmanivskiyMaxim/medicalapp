import { ApiProperty } from '@nestjs/swagger';
import { DoctorModel } from 'src/domain/model/doctorModel';
import { PatientModel } from 'src/domain/model/patientModel';

export class DoctorPresenter {
  @ApiProperty()
  id: number;
  @ApiProperty()
  accountId: number;
  @ApiProperty()
  specialty: string;
  @ApiProperty()
  qualification: string;
  @ApiProperty()
  patients: PatientModel[];

  constructor(patient: DoctorModel) {
    this.id = patient.id;
    this.accountId = patient.accountId;
    this.specialty = patient.specialty;
    this.qualification = patient.qualification;
    this.patients = patient.patients;
  }
}
