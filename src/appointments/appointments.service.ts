import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient } from '../patients/entities/patient.entity';
import { Repository } from 'typeorm';
import { CreateAppointmentDto } from '../appointments/dto/create-appointment.dto';
import { UpdateAppointmentDto } from '../appointments/dto/update-appointment.dto';
import { Appointment } from '../appointments/entities/appointment.entity';
import { checkAppointmentAvailability } from './appointment.helper';
import {
  PATIENT_NOT_FOUND,
  TIME_NOT_AVAILABLE,
} from '../appointments/errors.constants';

const MINIMUM_INTERVAL_DURATION_SECONDS = 3540;
@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepo: Repository<Appointment>,
    @InjectRepository(Patient)
    private patientRepo: Repository<Patient>,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto) {
    try {
      const patient = await this.patientRepo.findOne({
        where: { document: createAppointmentDto.document },
      });

      if (!patient) {
        const error = new HttpException(
          PATIENT_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
        throw error;
      }

      const startDateTime = new Date(createAppointmentDto.startDateTime);

      const appointment = new Appointment();
      Object.assign(appointment, createAppointmentDto);
      appointment.patientId = patient.id;

      const endDateTime = new Date(
        startDateTime.getTime() + MINIMUM_INTERVAL_DURATION_SECONDS * 1000,
      );
      appointment.endDateTime = endDateTime;

      const isAvailable = await checkAppointmentAvailability(
        this.appointmentRepo,
        appointment.startDateTime,
      );

      if (!isAvailable) {
        const error = new HttpException(
          TIME_NOT_AVAILABLE,
          HttpStatus.CONFLICT,
        );
        throw error;
      }

      return await this.appointmentRepo.save(appointment);
    } catch (error) {
      if (error.message.includes('External service unavailable')) {
        return Promise.reject(error);
      }
      return error;
    }
  }

  async findAll(): Promise<Appointment[]> {
    return await this.appointmentRepo.find();
  }

  async update(id: any, _updateAppointmentDto: UpdateAppointmentDto) {
    return await this.appointmentRepo.update(id, _updateAppointmentDto);
  }

  async remove(id: any) {
    return await this.appointmentRepo.delete(id);
  }
}
