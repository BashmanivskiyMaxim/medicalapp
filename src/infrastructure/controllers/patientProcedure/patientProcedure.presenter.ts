import { ApiProperty } from '@nestjs/swagger';

export class PatientProcedurePresenter {
  @ApiProperty()
  patientId: number;
  @ApiProperty()
  doctorId: number;
  @ApiProperty()
  procedureId: number;
  @ApiProperty()
  procedureDate: string;
  @ApiProperty()
  appointmentTime: string;
  @ApiProperty()
  report: object;
  @ApiProperty()
  rating: number;

  constructor(patientProcedure: any) {
    this.patientId = patientProcedure.patientId;
    this.doctorId = patientProcedure.doctorId;
    this.procedureId = patientProcedure.procedureId;
    this.procedureDate = patientProcedure.procedureDate;
    this.appointmentTime = patientProcedure.appointmentTime;
    this.report = patientProcedure.report;
    this.rating = patientProcedure.rating;
  }
}

export class PatientProcedurePickPresenter {
  @ApiProperty()
  id: number;
  @ApiProperty()
  procedureName: string;
  @ApiProperty()
  patientId: number;

  constructor(patientProcedure: any) {
    this.id = patientProcedure.id;
    this.procedureName = patientProcedure.procedureName;
    this.patientId = patientProcedure.patientId;
  }
}

export class PatientProcedureTimesPresenter {
  @ApiProperty()
  id: number;
  @ApiProperty()
  procedureTime: string;

  constructor(procedureTime: string) {
    this.procedureTime = procedureTime;
  }
}
