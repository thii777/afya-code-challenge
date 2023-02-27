import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from '../appointments/entities/appointment.entity';
import { Repository } from 'typeorm';
import { CreateMedicalConsultationNoteDto } from './dto/create-medical-consultation-note.dto';
import { MedicalConsultationNote } from './entities/medical-consultation-note.entity';
import { MEDICAL_CONSUTION_NOTE_NOT_FOUND } from './errors.constants';

@Injectable()
export class MedicalConsultationNotesService {
  constructor(
    @InjectRepository(MedicalConsultationNote)
    private medicalConsultationNoteRepo: Repository<MedicalConsultationNote>,

    @InjectRepository(Appointment)
    private appointmentRepo: Repository<Appointment>,
  ) {}

  async create(
    createMedicalConsultationNoteDto: CreateMedicalConsultationNoteDto,
  ) {
    try {
      const appointment = await this.appointmentRepo.findOne({
        where: {
          id: createMedicalConsultationNoteDto.appointmentId,
        },
      });

      if (!appointment) {
        const error = new HttpException(
          MEDICAL_CONSUTION_NOTE_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
        throw error;
      }

      return await this.medicalConsultationNoteRepo.save(
        createMedicalConsultationNoteDto,
      );
    } catch (error) {
      if (error.message.includes('External service unavailable')) {
        return Promise.reject(error);
      }
      return error;
    }
  }

  async findAllMedicalConsultationNotes(patientId: any) {
    const medicalConsultationNotes = this.medicalConsultationNoteRepo
      .createQueryBuilder('medicalConsultationNote')
      .leftJoinAndSelect('medicalConsultationNote.appointmentId', 'appointment')
      .where('appointment.patientId = :patientId', { patientId })
      .select([
        'medicalConsultationNote.id',
        'medicalConsultationNote.doctorName',
        'medicalConsultationNote.date',
        'medicalConsultationNote.notes',
      ])
      .orderBy('medicalConsultationNote.date', 'DESC')
      .getMany();

    return medicalConsultationNotes;
  }
}
