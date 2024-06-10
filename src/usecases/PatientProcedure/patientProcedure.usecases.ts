import { PatientProcedureRepository } from 'src/domain/repositories/patientProcedure.repository';
import {
  ConflictException,
  ForbiddenException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ProcedureRepository } from 'src/domain/repositories/procedure.repository';
import { PatientProcedureModel } from 'src/domain/model/patientProcedureModel';
import { DoctorRepository } from 'src/domain/repositories/doctor.repository.interface';
import { PatientRepository } from 'src/domain/repositories/patient.repository.interface';

export class addPatientProcedureUseCases {
  constructor(
    private readonly logger: Logger,
    private readonly procedureRepository: ProcedureRepository,
    private readonly doctorRepository: DoctorRepository,
    private readonly patientRepository: PatientRepository,
    private readonly patientProcedureRepository: PatientProcedureRepository,
  ) {}
  private ensureIsAdmin(accountType: string) {
    if (accountType !== 'admin') {
      throw new ForbiddenException(
        'Permission denied. Only admin can execute this operation.',
      );
    }
  }

  private ensureIsDoctor(accountType: string) {
    if (accountType !== 'doctor' && accountType !== 'admin') {
      throw new ForbiddenException(
        'Permission denied. Only doctors or admin can execute this operation.',
      );
    }
  }

  private ensureIsPatient(accountType: string) {
    if (accountType !== 'user') {
      throw new ForbiddenException(
        'Permission denied. Only user can execute this operation.',
      );
    }
  }

  async add(
    data: PatientProcedureModel,
    account: any,
  ): Promise<PatientProcedureModel> {
    this.ensureIsAdmin(account.accountType);

    const procedure = await this.procedureRepository.getDoctorByProcedureId(
      data.procedureId,
    );

    if (!procedure || procedure.deleted) {
      throw new ForbiddenException('Procedure not found or has been deleted');
    }

    const patientProcedure = new PatientProcedureModel();
    patientProcedure.doctorId = procedure.doctor.id;
    patientProcedure.patientId = 28;
    patientProcedure.procedureId = data.procedureId;
    patientProcedure.procedureDate = new Date();
    patientProcedure.createdDate = new Date();
    patientProcedure.updatedDate = new Date();
    patientProcedure.appointmentTime = data.appointmentTime;
    patientProcedure.report = { report: 'report' };
    patientProcedure.rating = 0;

    const result =
      await this.patientProcedureRepository.createPatientProcedure(
        patientProcedure,
      );

    this.logger.log(
      'addPatientProcedureUseCases execute',
      'New patient procedure has been inserted',
    );

    return result;
  }

  async update(account: any, id: string): Promise<PatientProcedureModel> {
    this.ensureIsPatient(account.accountType);

    const patient = await this.patientRepository.getPatientByAccountId(
      account.id,
    );
    if (!patient) {
      throw new ForbiddenException('Patient not found');
    }

    const currentProcedure =
      await this.patientProcedureRepository.getPatientProcedureById(+id);
    if (!currentProcedure) {
      throw new NotFoundException('Current procedure not found');
    }

    const procedureDate = new Date(currentProcedure.procedureDate)
      .toISOString()
      .split('T')[0];

    const existingProcedure =
      await this.patientProcedureRepository.getExistenseProcTodayByPatientId(
        patient.id,
        procedureDate,
        //currentProcedure.procedureId,
      );
    console.log('existingProcedure', existingProcedure);

    let inactiveProcedures = [];
    let overlappingProcedures = [];

    if (existingProcedure) {
      [inactiveProcedures, overlappingProcedures] = await Promise.all([
        this.patientProcedureRepository.getInactiveProceduresByDoctorAndTime(
          existingProcedure.doctorId,
          existingProcedure.appointmentTime,
          existingProcedure.procedureDate,
        ),
        this.patientProcedureRepository.getProceduresByDoctorAndTime(
          currentProcedure.doctorId,
          currentProcedure.appointmentTime,
          procedureDate,
        ),
      ]);
    } else {
      overlappingProcedures =
        await this.patientProcedureRepository.getProceduresByDoctorAndTime(
          currentProcedure.doctorId,
          currentProcedure.appointmentTime,
          procedureDate,
        );
    }

    try {
      if (existingProcedure) {
        existingProcedure.updatedDate = new Date();
        existingProcedure.patientId = 28;
        existingProcedure.report = { report: 'report' };
        existingProcedure.rating = 0;
        await this.patientProcedureRepository.updatePatientProcedure(
          existingProcedure.id,
          existingProcedure,
        );

        await Promise.all(
          inactiveProcedures.map(async (procedure) => {
            if (procedure.patientId !== patient.id && procedure.id !== +id) {
              procedure.patientId = 28;
              procedure.report = { report: 'report' };
              procedure.updatedDate = new Date();
              await this.patientProcedureRepository.updatePatientProcedure(
                procedure.id,
                procedure,
              );
            }
          }),
        );
      }

      currentProcedure.updatedDate = new Date();
      currentProcedure.patientId = patient.id;
      currentProcedure.report = { report: 'report' };

      const result =
        await this.patientProcedureRepository.updatePatientProcedure(
          +id,
          currentProcedure,
        );

      await Promise.all(
        overlappingProcedures.map(async (procedure) => {
          if (procedure.patientId === 28 && procedure.id !== +id) {
            procedure.patientId = 29;
            procedure.report = { report: 'report' };
            procedure.updatedDate = new Date();
            await this.patientProcedureRepository.updatePatientProcedure(
              procedure.id,
              procedure,
            );
          }
        }),
      );

      this.logger.log(
        'updatePatientProcedureUseCases execute',
        'Patient procedure has been updated',
      );

      return result;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(
          'Неможливо записатися на дві різні процедури одночасно',
        );
      } else {
        throw error;
      }
    }
  }

  async delete(id: string, account: { accountType: string }) {
    this.ensureIsAdmin(account.accountType);
    await this.patientProcedureRepository.deletePatientProcedure(+id);
    this.logger.log(
      'deletePatientProcedureUseCases execute',
      'Patient procedure have been deleted',
    );
  }

  async getById(id: string, account: any) {
    const patient = await this.patientRepository.getPatientByAccountId(
      account.id,
    );
    const patientProcedure =
      await this.patientProcedureRepository.getPatientProcedureById(+id);
    if (!patientProcedure) {
      throw new ForbiddenException('Patient procedure not found');
    }
    if (patient.id !== patientProcedure.patientId) {
      throw new ForbiddenException('Permission denied');
    }
    this.logger.log(
      'getPatientProcedureUseCases execute',
      'Patient procedure have been found',
    );

    return patientProcedure;
  }

  async dailyScheduleProcedure() {
    try {
      const appointmentTime = [
        '9:00',
        '10:00',
        '11:00',
        '12:00',
        '13:00',
        '15:00',
        '16:00',
        '17:00',
      ];
      const procedures = await this.procedureRepository.getProcedures();
      const appointmentsPerProcedure = 8;
      const daysToSchedule = 4;

      for (let dayOffset = 0; dayOffset < daysToSchedule; dayOffset++) {
        const procedureDate = new Date();
        procedureDate.setDate(procedureDate.getDate() + dayOffset);

        const createProceduresPromises = [];

        for (const procedure of procedures) {
          for (let i = 0; i < appointmentsPerProcedure; i++) {
            const appointmentTimeSlot = appointmentTime[i];

            const createProcedurePromise = (async () => {
              const existingProcedures =
                await this.patientProcedureRepository.getExistenseProcedure(
                  procedure,
                  procedureDate,
                  appointmentTimeSlot,
                );

              if (!existingProcedures) {
                const patientProcedure = new PatientProcedureModel();
                patientProcedure.doctorId = procedure.doctorId;
                patientProcedure.patientId = 28;
                patientProcedure.procedureId = procedure.id;
                patientProcedure.procedureDate = procedureDate;
                patientProcedure.createdDate = new Date();
                patientProcedure.updatedDate = new Date();
                patientProcedure.appointmentTime = appointmentTimeSlot;
                patientProcedure.report = { report: 'report' };
                patientProcedure.rating = 0;
                await this.patientProcedureRepository.createPatientProcedure(
                  patientProcedure,
                );
              }
            })();

            createProceduresPromises.push(createProcedurePromise);
          }
        }
        await Promise.all(createProceduresPromises);
      }

      this.logger.log(
        'DailyProceduresSchedulerStrategy',
        'Procedures scheduled for today and the next 3 days',
      );
    } catch (error) {
      this.logger.error(
        'DailyProceduresSchedulerStrategy',
        'Error scheduling procedures',
      );
    }
  }

  async scheduleDeleteProcedure() {
    try {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      const endOfDay = new Date(today.setHours(23, 59, 59, 999));

      await this.patientProcedureRepository.deleteSchedule(
        startOfDay,
        endOfDay,
      );
    } catch (error) {
      this.logger.error(
        'proceduresDeleteSchedulerStrategy',
        'Error deleting procedures',
      );
    }
  }

  async getAll(account: any) {
    this.ensureIsAdmin(account.accountType);
    const patientProcedures =
      await this.patientProcedureRepository.getAllProcedures();
    this.logger.log(
      'getPatientProceduresUseCases execute',
      'All patient procedures have been fetched',
    );
    return patientProcedures;
  }

  async getMyProcedures(account: any) {
    const patient = await this.patientRepository.getPatientByAccountId(
      account.id,
    );
    if (!patient) {
      throw new ForbiddenException('Patient not found');
    }
    const patientProcedures =
      await this.patientProcedureRepository.getPatientProcedures(patient.id);
    if (!patientProcedures.length) {
      throw new ForbiddenException('Patient procedures not found');
    }
    if (patient.id !== patientProcedures[0].patientId) {
      throw new ForbiddenException('Permission denied');
    }
    this.logger.log(
      'getMyProceduresUseCases execute',
      'All patient procedures have been fetched',
    );
    return patientProcedures;
  }

  async getDoctorProcedures(
    account: any,
    category: 'past' | 'today' | 'future',
    page: number,
    pageSize: number,
  ) {
    this.ensureIsDoctor(account.accountType);
    const doctors = await this.doctorRepository.findByAccountId(account.id);

    if (!doctors || doctors.length === 0) {
      throw new ForbiddenException('Doctor not found');
    }

    let procedures = [];
    let total = 0;

    for (const doctor of doctors) {
      let result;
      if (category === 'past') {
        result =
          await this.patientProcedureRepository.getPastProceduresByDoctorId(
            +doctor.id,
            page,
            pageSize,
          );
      } else if (category === 'today') {
        result =
          await this.patientProcedureRepository.getTodayProceduresByDoctorId(
            +doctor.id,
            page,
            pageSize,
          );
      } else if (category === 'future') {
        result =
          await this.patientProcedureRepository.getFutureProceduresByDoctorId(
            +doctor.id,
            page,
            pageSize,
          );
      }

      if (result) {
        procedures = procedures.concat(result.data);
        total += result.total;
      }
    }

    this.logger.log(
      'getDoctorProceduresUseCases execute',
      'All doctor procedures have been fetched',
    );

    return { doctorProcedures: procedures, total };
  }

  async getReport(id: string, account: any) {
    const patientProcedure =
      await this.patientProcedureRepository.getPatientProcedureById(+id);
    if (!patientProcedure) {
      throw new ForbiddenException('Patient procedure not found');
    }
    if (account.accountType === 'doctor') {
      const doctor = await this.doctorRepository.findByAccountId(account.id);
      if (!doctor) {
        throw new ForbiddenException('Doctor not found or permission denied');
      }
    }
    if (account.accountType === 'user') {
      const patient = await this.patientRepository.getPatientByAccountId(
        account.id,
      );
      if (!patient) {
        throw new ForbiddenException('Patient not found or permission denied');
      }
      if (patient.id !== patientProcedure.patientId) {
        throw new ForbiddenException('Permission denied');
      }
    }

    this.logger.log(
      'getReportUseCases execute',
      'Patient procedure report has been fetched',
    );
    return patientProcedure.report;
  }

  async searchProcedures(
    keyword: string,
    account: any,
  ): Promise<{ data: any[]; total: number }> {
    this.ensureIsDoctor(account.accountType);

    let result = [];
    let total = 0;

    if (account.accountType === 'user') {
      const patient = await this.patientRepository.getPatientByAccountId(
        account.id,
      );
      if (!patient) throw new ForbiddenException('Patient not found');

      const searchResult =
        await this.patientProcedureRepository.searchProceduresByKeyWord(
          keyword,
          +patient.id,
          'patient',
        );
      result = searchResult[0];
      total = searchResult[1];
    } else if (account.accountType === 'doctor') {
      const doctors = await this.doctorRepository.findByAccountId(account.id);
      if (!doctors || doctors.length === 0)
        throw new ForbiddenException('Doctor not found');

      for (const doctor of doctors) {
        const searchResult =
          await this.patientProcedureRepository.searchProceduresByKeyWord(
            keyword,
            +doctor.id,
            'doctor',
          );
        result = result.concat(searchResult[0]);
        total += searchResult[1];
      }
    } else {
      throw new ForbiddenException('Invalid account type');
    }

    this.logger.log(
      'searchProceduresUseCases execute',
      'Procedures have been fetched by keyword',
    );

    return { data: result, total };
  }

  async rateProcedure(id: string, rating: number, account: any) {
    const patientProcedure =
      await this.patientProcedureRepository.getPatientProcedureById(+id);
    if (!patientProcedure) {
      throw new ForbiddenException('Patient procedure not found');
    }
    const patient = await this.patientRepository.getPatientByAccountId(
      account.id,
    );
    if (!patient) {
      throw new ForbiddenException('Patient not found');
    }
    if (patient.id !== patientProcedure.patientId) {
      throw new ForbiddenException('Permission denied');
    }
    patientProcedure.rating = rating;
    patientProcedure.updatedDate = new Date();
    const result = await this.patientProcedureRepository.updatePatientProcedure(
      +id,
      patientProcedure,
    );
    this.logger.log(
      'rateProcedureUseCases execute',
      'Patient procedure have been rated',
    );
    return result;
  }

  async reportProcedure(id: string, report: object, account: any) {
    const patientProcedure =
      await this.patientProcedureRepository.getPatientProcedureById(+id);
    if (!patientProcedure) {
      throw new ForbiddenException('Patient procedure not found');
    }
    const doctors = await this.doctorRepository.findByAccountId(account.id);
    if (!doctors || doctors.length === 0) {
      throw new ForbiddenException('Doctor not found');
    }

    const isAuthorizedDoctor = doctors.some(
      (doctor: any) => doctor.id === patientProcedure.doctorId,
    );
    if (!isAuthorizedDoctor) {
      throw new ForbiddenException('Permission denied');
    }

    patientProcedure.report = report;
    patientProcedure.updatedDate = new Date();
    const result = await this.patientProcedureRepository.updatePatientProcedure(
      +id,
      patientProcedure,
    );
    this.logger.log(
      'reportProcedureUseCases execute',
      'Patient procedure has been reported',
    );
    return result;
  }

  async getProceduresByDate(procedureId: number, date: string) {
    const patientProcedures =
      await this.patientProcedureRepository.getPatientProceduresTimesByDate(
        date,
        procedureId,
      );
    console.log('patientProcedures', patientProcedures);

    if (!patientProcedures.length) {
      throw new ForbiddenException('Procedures not found');
    }

    const timesWithoutSeconds = patientProcedures.map((procedure) => ({
      id: procedure.id,
      appointmentTime: procedure.appointmentTime.slice(0, -3),
      appointmentDate: procedure.appointmentDate,
    }));
    this.logger.log(
      'getProceduresByDate execute',
      'Procedures times have been fetched',
    );

    return timesWithoutSeconds;
  }

  async cancelProcedure(id: string, account: any) {
    const patientProcedure =
      await this.patientProcedureRepository.getPatientProcedureById(+id);
    if (!patientProcedure) {
      throw new ForbiddenException('Patient procedure not found');
    }

    const patient = await this.patientRepository.getPatientByAccountId(
      account.id,
    );
    if (!patient) {
      throw new ForbiddenException('Patient not found');
    }

    if (patient.id !== patientProcedure.patientId) {
      throw new ForbiddenException('Permission denied');
    }

    patientProcedure.updatedDate = new Date();
    patientProcedure.report = { report: 'report' };
    patientProcedure.patientId = 28;
    await this.patientProcedureRepository.updatePatientProcedure(
      +id,
      patientProcedure,
    );

    const inactiveProcedures =
      await this.patientProcedureRepository.getInactiveProceduresByDoctorAndTime(
        patientProcedure.doctorId,
        patientProcedure.appointmentTime,
        patientProcedure.procedureDate,
      );

    for (const procedure of inactiveProcedures) {
      if (procedure.patientId !== patient.id && procedure.id !== +id) {
        procedure.patientId = 28;
        procedure.report = { report: 'report' };
        procedure.updatedDate = new Date();
        await this.patientProcedureRepository.updatePatientProcedure(
          procedure.id,
          procedure,
        );
      }
    }

    this.logger.log(
      'cancelProcedureUseCases execute',
      'Patient procedure has been canceled and all inactive procedures have been updated.',
    );
  }

  async scheduleMyDay(account: any) {
    this.ensureIsPatient(account.accountType);

    const appointmentTimes = [
      '9:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '15:00',
      '16:00',
      '17:00',
    ];

    const patient = await this.patientRepository.getPatientByAccountId(
      account.id,
    );
    if (!patient) {
      throw new ForbiddenException('Patient not found');
    }

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    let availableProcedures =
      await this.patientProcedureRepository.getAvailableProceduresByDay(
        todayStr,
      );
    availableProcedures.sort((a, b) => b.rating - a.rating);

    const userPreferences =
      await this.patientProcedureRepository.getUserPreferences(patient.id);
    const scheduledProcedures = [];

    for (const time of appointmentTimes) {
      if (availableProcedures.length === 0) break;

      let preferredProcedures = availableProcedures.filter((proc) =>
        userPreferences.includes(proc.procedure.id),
      );

      if (preferredProcedures.length === 0) {
        preferredProcedures = availableProcedures;
      }

      const procedureToSchedule = preferredProcedures.shift();

      if (!procedureToSchedule) {
        continue;
      }

      scheduledProcedures.push({
        id: procedureToSchedule.id,
        patientId: patient.id,
        procedureId: procedureToSchedule.procedure.id,
        appointmentTime: time,
        procedureDate: today,
        doctorId: procedureToSchedule.doctorId,
      });

      availableProcedures = availableProcedures.filter(
        (proc) => proc.procedure.id !== procedureToSchedule.procedure.id,
      );
    }

    for (const proc of scheduledProcedures) {
      const existingProcedure =
        await this.patientProcedureRepository.getExistenseProcedure(
          28,
          proc.procedureDate,
          proc.appointmentTime,
        );

      if (existingProcedure) {
        const patientProcedure = new PatientProcedureModel();
        patientProcedure.id = proc.id;
        patientProcedure.doctorId = proc.doctorId;
        patientProcedure.patientId = proc.patientId;
        patientProcedure.procedureId = proc.procedureId;
        patientProcedure.procedureDate = proc.procedureDate;
        patientProcedure.createdDate = proc.createdDate;
        patientProcedure.updatedDate = new Date();
        patientProcedure.appointmentTime = proc.appointmentTime;
        patientProcedure.report = { report: 'Ваш звіт' };
        patientProcedure.rating = 0;

        await this.patientProcedureRepository.updatePatientProcedure(
          patientProcedure.id,
          patientProcedure,
        );
      } else {
        console.log(
          `Procedure already exists for patient ${proc.patientId} at ${proc.appointmentTime}`,
        );
      }
    }

    this.logger.log(
      'scheduleMyDay',
      `User ${patient.id} scheduled for procedures`,
    );
  }

  async getPatientInfoByProcedureId(patientProcedureId: number, account: any) {
    const patientProcedureDoctor =
      await this.patientProcedureRepository.getPatientProcedureById(
        patientProcedureId,
      );
    if (!patientProcedureDoctor) {
      throw new NotFoundException('Doctor for the patient procedure not found');
    }

    const doctors = await this.doctorRepository.findByAccountId(account.id);
    if (!doctors || doctors.length === 0) {
      throw new NotFoundException('Doctor not found');
    }

    const hasPermission = doctors.some(
      (doctor) => doctor.id === patientProcedureDoctor.doctorId,
    );
    if (!hasPermission) {
      throw new ForbiddenException('Permission denied');
    }

    const patientInfo = await this.patientRepository.getPatientById(
      +patientProcedureDoctor.patientId,
    );
    if (!patientInfo) {
      throw new NotFoundException('Patient not found');
    }

    this.logger.log(
      'getPatientInfoByProcedureId',
      `Patient ${patientInfo.id} info has been fetched`,
    );

    return patientInfo;
  }
  async getTodayPatientProcedures(patientId: number) {
    const patientProcedures =
      await this.patientProcedureRepository.getTodayPatientProcedures(
        patientId,
      );
    return patientProcedures;
  }
}
