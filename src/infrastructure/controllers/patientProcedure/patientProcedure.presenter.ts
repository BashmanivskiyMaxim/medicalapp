import { ApiProperty } from '@nestjs/swagger';
import { DoctorModel } from 'src/domain/model/doctorModel';
import { PatientModel } from 'src/domain/model/patientModel';
import { ProcedureModel } from 'src/domain/model/procedureModel';

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
  appointmentTime: string;
  @ApiProperty()
  appointmentDate: string;

  constructor(patientProcedure: any) {
    this.id = patientProcedure.id;
    this.appointmentTime = patientProcedure.appointmentTime;
    this.appointmentDate = patientProcedure.appointmentDate;
  }
}

export class PatientProcedureForPatientPresenter {
  @ApiProperty()
  id: string;
  @ApiProperty()
  doctor: DoctorModel;
  @ApiProperty()
  procedureDate: string;
  @ApiProperty()
  updatedDate: string;
  @ApiProperty()
  appointmentTime: string;
  @ApiProperty()
  report: object;
  @ApiProperty()
  rating: number;
  @ApiProperty()
  procedure: ProcedureModel;

  constructor(patientProcedure: any) {
    this.id = patientProcedure.id;
    this.doctor = patientProcedure.doctor;
    this.procedureDate = patientProcedure.procedureDate;
    this.updatedDate = patientProcedure.updatedDate;
    this.appointmentTime = patientProcedure.appointmentTime;
    this.report = patientProcedure.report;
    this.rating = patientProcedure.rating;
    this.procedure = patientProcedure.procedure;
  }
}

export class PatientProcedureForDoctorPresenter {
  @ApiProperty()
  id: string;
  @ApiProperty()
  patient: PatientModel;
  @ApiProperty()
  procedureDate: string;
  @ApiProperty()
  updatedDate: string;
  @ApiProperty()
  appointmentTime: string;
  @ApiProperty()
  report: object;
  @ApiProperty()
  rating: number;
  @ApiProperty()
  procedure: ProcedureModel;

  constructor(patientProcedure: any) {
    this.id = patientProcedure.id;
    this.patient = patientProcedure.patient;
    this.procedureDate = patientProcedure.procedureDate;
    this.updatedDate = patientProcedure.updatedDate;
    this.appointmentTime = patientProcedure.appointmentTime;
    this.report = patientProcedure.report;
    this.rating = patientProcedure.rating;
    this.procedure = patientProcedure.procedure;
  }
}

export class ReportPresenter {
  @ApiProperty()
  report: object;

  constructor(report: any) {
    this.report = report;
  }
}
