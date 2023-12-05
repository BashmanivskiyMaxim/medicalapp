export class ScheduleModel {
  id: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  doctorId: number;

  constructor(
    id: number,
    dayOfWeek: string,
    startTime: string,
    endTime: string,
    doctorId: number,
  ) {
    this.id = id;
    this.dayOfWeek = dayOfWeek;
    this.startTime = startTime;
    this.endTime = endTime;
    this.doctorId = doctorId;
  }
}
