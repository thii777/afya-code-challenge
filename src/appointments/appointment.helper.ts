import { HttpException, HttpStatus } from '@nestjs/common';

const MINIMUM_INTERVAL_DURATION_SECONDS = 3540;
const whereClause =
  '(appointment.startDateTime <= :startDateTime AND appointment.endDateTime >= :startDateTime) OR (appointment.startDateTime <= :endDateTime AND appointment.endDateTime >= :endDateTime)';

export async function checkAppointmentAvailability(
  appointmentRepo: any,
  startDateTime: Date,
): Promise<boolean> {
  startDateTime = new Date(startDateTime);

  let endDateTime = new Date(startDateTime);
  const now = new Date();
  if (
    startDateTime.getTime() <
    now.getTime() + MINIMUM_INTERVAL_DURATION_SECONDS * 1000
  ) {
    throw new HttpException('Invalid date', HttpStatus.BAD_REQUEST);
  }

  endDateTime = new Date(
    endDateTime.getTime() + MINIMUM_INTERVAL_DURATION_SECONDS * 1000,
  );

  const existingAppointment = await appointmentRepo
    .createQueryBuilder('appointment')
    .where(whereClause, { startDateTime, endDateTime })
    .getOne();

  return !existingAppointment;
}
