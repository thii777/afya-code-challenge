import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAppointmentDto } from '../appointments/dto/create-appointment.dto';
import { Appointment } from '../appointments/entities/appointment.entity';
import { Patient } from '../patients/entities/patient.entity';
import { AppointmentsService } from './appointments.service';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

describe('AppointmentsService', () => {
  let appointmentService: AppointmentsService;
  let appointmentRepository: Repository<Appointment>;
  let patientRepository: Repository<Patient>;

  const createAppointmentDto: CreateAppointmentDto = {
    document: '12345678901',
    details: '1199199258',
    startDateTime: new Date().toString(),
  };

  const updateAppointmentDto: UpdateAppointmentDto = {
    document: '12345678901',
    details: '1199199258',
  };

  const uuidMock = '970bcb8c-b9eb-42bf-9069-efc76fe79dd9';

  const patient = new Patient();
  patient.id = '91bf8fe2-3e78-4747-ac8d-68a88c390399';

  const appointment = new Appointment();
  Object.assign(appointment, createAppointmentDto);
  appointment.patientId = '91bf8fe2-3e78-4747-ac8d-68a88c390399';

  const expectedAppointment: Appointment = {
    id: 'a308d5c5-e5b1-40a2-8b8d-7d142bdf5a31',
    document: '12345678901',
    startDateTime: new Date('2023-02-27 14:40:00.000Z'),
    endDateTime: expect.any(Date),
    patientId: '91bf8fe2-3e78-4747-ac8d-68a88c390399',
    MedicalConsultationNotes: [],
    createdAt: new Date('2023-02-27 14:40:00.000Z'),
    updatedAt: new Date('2023-02-27 14:40:00.000Z'),
  };

  const expectUpdateAppointment = {
    generatedMaps: [],
    raw: [],
    affected: 1,
  };

  const expectRemoveAppointment = {
    ...expectUpdateAppointment,
  };

  const appointments = [
    {
      id: '970bcb8c-b9eb-42bf-9069-efc76fe79dd9',
      document: '33615840860',
      startDateTime: '2023-02-25T14:40:00.000Z',
      endDateTime: '2023-02-23T17:19:58.359Z',
      patient: '7a8753cd-c898-437e-8d1b-10b7e386916d',
      createdAt: '2023-02-23T17:19:58.359Z',
      updatedAt: '2023-02-23T17:19:58.359Z',
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentsService,
        {
          provide: getRepositoryToken(Appointment),
          useClass: jest.fn(() => ({
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
          })),
        },
        {
          provide: 'PatientRepository',
          useClass: jest.fn(() => ({
            findOne: jest.fn(),
          })),
        },
      ],
    }).compile();

    appointmentService = module.get<AppointmentsService>(AppointmentsService);
    appointmentRepository = module.get<Repository<Appointment>>(
      getRepositoryToken(Appointment),
    );
    patientRepository = module.get<Repository<Patient>>(
      getRepositoryToken(Patient),
    );
  });

  describe('create', () => {
    it('should create an appointment successfully', async () => {
      jest
        .spyOn(appointmentRepository, 'save')
        .mockResolvedValue(expectedAppointment);

      patientRepository.findOne = jest.fn().mockResolvedValue(patient);
      appointmentRepository.findOne = jest.fn().mockResolvedValue(undefined);

      const result = await appointmentService.create(createAppointmentDto);

      expect(appointmentRepository.save).toHaveBeenCalledWith({
        ...appointment,
      });

      expect(result).toEqual(expectedAppointment);
    });
  });

  describe('update', () => {
    it('should update an appointment successfully', async () => {
      jest
        .spyOn(appointmentRepository, 'update')
        .mockResolvedValue(expectUpdateAppointment);

      patientRepository.findOne = jest.fn().mockResolvedValue(patient);
      appointmentRepository.findOne = jest.fn().mockResolvedValue(undefined);

      const result = await appointmentService.update(
        uuidMock,
        updateAppointmentDto,
      );

      expect(appointmentRepository.update).toHaveBeenCalledWith(
        uuidMock,
        updateAppointmentDto,
      );

      expect(result).toEqual(expectUpdateAppointment);
    });
  });

  describe('findAll', () => {
    it('should return an array of appointments', async () => {
      appointmentRepository.find = jest.fn().mockResolvedValue(appointments);

      await expect(appointmentService.findAll()).resolves.toEqual(appointments);
    });
  });

  describe('remove', () => {
    it('should remove an appointment successfully', async () => {
      jest
        .spyOn(appointmentRepository, 'delete')
        .mockResolvedValue(expectRemoveAppointment);

      const result = await appointmentService.remove(uuidMock);

      expect(appointmentRepository.delete).toHaveBeenCalledWith(uuidMock);

      expect(result).toEqual(expectRemoveAppointment);
    });
  });
});
