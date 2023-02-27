import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient } from '../patients/entities/patient.entity';
import { Between, Repository } from 'typeorm';
import { CreateAppointmentDto } from '../appointments/dto/create-appointment.dto';
import { UpdateAppointmentDto } from '../appointments/dto/update-appointment.dto';
import { Appointment } from '../appointments/entities/appointment.entity';
import {
  INVALID_DATE,
  PATIENT_NOT_FOUND,
} from '../appointments/errors.constants';

const MINIMUM_INTERVAL_DURATION_SECONDS = 3600;

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
  ) {}

  async verificarDisponibilidade(startDateTime: Date): Promise<boolean> {
    startDateTime = new Date(startDateTime);
    startDateTime.setHours(startDateTime.getHours() + 3);

    const now = new Date();

    if (
      startDateTime.getTime() <
      now.getTime() + MINIMUM_INTERVAL_DURATION_SECONDS * 1000
    ) {
      throw new HttpException(INVALID_DATE, HttpStatus.BAD_REQUEST);
    }

    const oneHourLater = new Date(startDateTime.getTime() + 60 * 60 * 1000);
    const agendamentos = await this.appointmentRepository.findOne({
      where: {
        startDateTime: Between(startDateTime, oneHourLater),
      },
    });
    if (!agendamentos) return true;
  }

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

      console.log(createAppointmentDto, '1');
      const appointment = new Appointment();
      Object.assign(appointment, createAppointmentDto);
      appointment.patientId = patient.id;

      // const disponivel = await this.verificarDisponibilidade(
      //   appointment.startDateTime,
      // );

      // if (!disponivel) {
      //   throw new Error('O horário selecionado não está disponível');
      // }
      console.log(appointment, 'appointment');
      return await this.appointmentRepository.save(appointment);
    } catch (error) {
      console.log(error, 'error');
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
