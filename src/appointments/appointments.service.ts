import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient } from '../patients/entities/patient.entity';
import { Repository } from 'typeorm';
import { CreateAppointmentDto } from '../appointments/dto/create-appointment.dto';
import { UpdateAppointmentDto } from '../appointments/dto/update-appointment.dto';
import { Appointment } from '../appointments/entities/appointment.entity';
import {
  TIME_NOT_AVAILABLE,
  PATIENT_NOT_FOUND,
} from '../appointments/errors.constants';
import { checkAppointmentAvailability } from './appointment.helper';

const MINIMUM_INTERVAL_DURATION_SECONDS = 3540;
@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto) {
    try {
      const patient = await this.patientRepository.findOne({
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
        this.appointmentRepository,
        appointment.startDateTime,
      );

      if (!isAvailable) {
        const error = new HttpException(
          TIME_NOT_AVAILABLE,
          HttpStatus.CONFLICT,
        );
        throw error;
      }

      return await this.appointmentRepository.save(appointment);
    } catch (error) {
      if (error.message.includes('External service unavailable')) {
        return Promise.reject(error);
      }
      return error;
    }
  }

  async findAll(): Promise<Appointment[]> {
    return await this.appointmentRepository.find();
  }

  async update(id: any, _updateAppointmentDto: UpdateAppointmentDto) {
    console.log(id, _updateAppointmentDto, 'update appoint');
    return await this.appointmentRepository.update(id, _updateAppointmentDto);
  }

  async remove(id: any) {
    return await this.appointmentRepository.delete(id);
  }
}
