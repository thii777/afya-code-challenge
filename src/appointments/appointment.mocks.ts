import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Appointment } from './entities/appointment.entity';

export class ObjectAppoitmentMock {
  public appointment = {
    id: '970bcb8c-b9eb-42bf-9069-efc76fe79dd9',
    document: '33615840860',
    startDateTime: '2023-02-25T14:40:00.000Z',
    endDateTime: '2023-02-23T17:19:58.359Z',
    patient: '7a8753cd-c898-437e-8d1b-10b7e386916d',
    createdAt: '2023-02-23T17:19:58.359Z',
    updatedAt: '2023-02-23T17:19:58.359Z',
  };

  public createAppointmentDto = {
    document: '12345678901',
    details: '1199199258',
    startDateTime: '2023-02-25T14:40:00.000Z',
    endDateTime: '2023-02-25T15:39:00.000Z',
  };
  public updateAppointmentDto: UpdateAppointmentDto = {
    document: '12345678901',
    details: '1199199258',
  };
  public expectedAppointment: Appointment = {
    id: 'a308d5c5-e5b1-40a2-8b8d-7d142bdf5a31',
    document: '12345678901',
    startDateTime: new Date('2023-02-27 14:40:00.000Z'),
    endDateTime: new Date('2023-02-27 15:40:00.000Z'),
    patientId: '91bf8fe2-3e78-4747-ac8d-68a88c390399',
    MedicalConsultationNotes: [],
    createdAt: new Date('2023-02-27 14:40:00.000Z'),
    updatedAt: new Date('2023-02-27 14:40:00.000Z'),
  };
}
