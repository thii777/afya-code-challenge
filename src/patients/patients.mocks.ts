import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Patient } from './entities/patient.entity';

export class ObjectPatientMock {
  public patientId: '91bf8fe2-3e78-4747-ac8d-68a88c390399';

  public createPatientDto: CreatePatientDto = {
    name: 'Fulano de Tal',
    phone: '+5511999999999',
    email: 'fulano@example.com',
    document: '123456789',
    birthday: '2000-01-01',
    gender: 'M',
    height: '1.75',
    weight: '70',
  };

  public updatePatientDto: UpdatePatientDto = {
    phone: '+5511999999999',
    email: 'fulano@example.com',
  };

  public expectedPatient: Patient = {
    ...this.createPatientDto,
    id: 'd48a9772-914c-4293-b3e3-096604f693d1',
    birthday: new Date(),
    appointments: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  public patients = [
    {
      name: 'Thiago documentation',
      phone: '+55 11 99999-9999.',
      email: 'thiago.update@gmail.com',
      document: '33615840864',
      birthday: '1986-09-05 14:40:00.000Z',
      gender: 'male',
      height: '168',
      weight: '68',
      id: '91bf8fe2-3e78-4747-ac8d-68a88c390399',
      createdAt: '2023-02-24T19:20:30.338Z',
      updatedAt: '2023-02-24T19:20:30.338Z',
    },
  ];
}
