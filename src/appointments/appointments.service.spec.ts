import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from '../appointments/entities/appointment.entity';
import { Patient } from '../patients/entities/patient.entity';
import { ObjectPatientMock } from '../patients/patients.mocks';
import { ObjectAppoitmentMock } from './appointment.mocks';
import { ObjectGeneralMock } from '../mocks';
import { AppointmentsService } from './appointments.service';
import * as checkAppointmentAvailability from './appointment.helper';

describe('AppointmentsService', () => {
  let appointmentService: AppointmentsService;
  let appointmentRepository: Repository<Appointment>;
  let patientRepository: Repository<Patient>;
  let objectAppoitmentMock: ObjectAppoitmentMock;
  let objectGeneralMock: ObjectGeneralMock;
  let objectPatientMock: ObjectPatientMock;

  beforeEach(async () => {
    objectAppoitmentMock = new ObjectAppoitmentMock();
    objectGeneralMock = new ObjectGeneralMock();
    objectPatientMock = new ObjectPatientMock();

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
    let expectedAppointment;
    let createAppointmentDto;
    let patientId;
    it('should create an appointment successfully', async () => {
      expectedAppointment = objectAppoitmentMock.expectedAppointment;
      createAppointmentDto = objectAppoitmentMock.createAppointmentDto;
      patientId = objectPatientMock.patientId;
      const patient = new Patient();
      patient.id = patientId;

      const endDateTime = new Date(createAppointmentDto.endDateTime);

      const appointment = new Appointment();
      Object.assign(appointment, createAppointmentDto);
      appointment.patientId = patientId;
      appointment.endDateTime = endDateTime;

      jest
        .spyOn(checkAppointmentAvailability, 'checkAppointmentAvailability')
        .mockResolvedValue(true);

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
    let expectUpdateAppointment;
    let updateAppointmentDto;
    let uuidMock;
    let patientId;
    let patient;

    it('should update an appointment successfully', async () => {
      expectUpdateAppointment = objectGeneralMock.objectAffected;
      updateAppointmentDto = objectAppoitmentMock.updateAppointmentDto;
      uuidMock = objectGeneralMock.uuidMock;
      patientId = objectPatientMock.patientId;
      patient = new Patient();
      patient.id = patientId;

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

    it('should reject with an error if appointmentRepository.update throws an error', async () => {
      patient = new Patient();
      patient.id = patientId;
      const error = new Error('Database error');

      jest.spyOn(appointmentRepository, 'update').mockRejectedValue(error);
      patientRepository.findOne = jest.fn().mockResolvedValue(patient);
      appointmentRepository.findOne = jest.fn().mockResolvedValue(undefined);

      await expect(
        appointmentService.update(uuidMock, updateAppointmentDto),
      ).rejects.toThrow('Database error');

      expect(appointmentRepository.update).toHaveBeenCalledWith(
        uuidMock,
        updateAppointmentDto,
      );
    });
  });

  describe('findAll', () => {
    let appointments;
    it('should return an array of appointments', async () => {
      appointments = objectAppoitmentMock.appointment;
      appointmentRepository.find = jest.fn().mockResolvedValue(appointments);

      await expect(appointmentService.findAll()).resolves.toEqual(appointments);
    });

    it('should reject with an error if appointmentRepository.find throws an error', async () => {
      const error = new Error('Database error');
      appointmentRepository.find = jest.fn().mockRejectedValue(error);

      await expect(appointmentService.findAll()).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('remove', () => {
    let uuidMock;
    let expectRemoveAppointment;
    it('should remove an appointment successfully', async () => {
      uuidMock = objectGeneralMock.uuidMock;
      expectRemoveAppointment = objectGeneralMock.objectAffected;
      jest
        .spyOn(appointmentRepository, 'delete')
        .mockResolvedValue(expectRemoveAppointment);

      const result = await appointmentService.remove(uuidMock);

      expect(appointmentRepository.delete).toHaveBeenCalledWith(uuidMock);

      expect(result).toEqual(expectRemoveAppointment);
    });

    it('should reject with an error if appointmentRepository.delete throws an error', async () => {
      const error = new Error('Database error');
      jest.spyOn(appointmentRepository, 'delete').mockRejectedValue(error);

      await expect(appointmentService.remove(uuidMock)).rejects.toThrow(
        'Database error',
      );

      expect(appointmentRepository.delete).toHaveBeenCalledWith(uuidMock);
    });
  });
});
