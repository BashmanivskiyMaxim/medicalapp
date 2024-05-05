import { Module } from '@nestjs/common';
import { UsecasesProxyModule } from '../usecases-proxy/usecases-proxy.module';
import { PatientController } from './patient/patient.controller';
import { DoctorController } from './doctor/doctor.controller';
import { AddressController } from './address/address.controller';
import { AuthController } from './auth/auth.controller';
import { ContactInfoController } from './contactInfo/contactInfo.controller';
import { MessageController } from './message/message.controller';
import { ProcedureController } from './procedure/procedure.controller';

@Module({
  imports: [UsecasesProxyModule.regiter()],
  controllers: [
    PatientController,
    DoctorController,
    AddressController,
    AuthController,
    ContactInfoController,
    MessageController,
    ProcedureController,
  ],
})
export class ControllersModule {}
