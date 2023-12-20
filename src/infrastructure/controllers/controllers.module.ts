import { Module } from '@nestjs/common';
import { UsecasesProxyModule } from '../usecases-proxy/usecases-proxy.module';
import { PatientController } from './patient/patient.controller';
import { DoctorController } from './doctor/doctor.controller';
import { AppointmentController } from './appointment/appointment.controller';
import { AddressController } from './address/address.controller';
import { AccountController } from './account/account.controller';
import { ContactInfoController } from './contactInfo/contactInfo.controller';
import { MedicalHistoryController } from './medicalHistory/medicalHistory.controller';
import { MedicalProcedureController } from './medicalProcedure/medicalProcedure.controller';
import { MessageController } from './message/message.controller';
import { ScheduleController } from './schedule/schedule.controller';

@Module({
  imports: [UsecasesProxyModule.regiter()],
  controllers: [
    PatientController,
    DoctorController,
    AppointmentController,
    AddressController,
    AccountController,
    ContactInfoController,
    MedicalHistoryController,
    MedicalProcedureController,
    MessageController,
    ScheduleController,
  ],
})
export class ControllersModule {}
