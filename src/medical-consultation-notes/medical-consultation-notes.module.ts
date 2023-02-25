import { Module } from '@nestjs/common';
import { MedicalConsultationNotesService } from './medical-consultation-notes.service';
import { MedicalConsultationNotesController } from './medical-consultation-notes.controller';
import { Appointment } from '../appointments/entities/appointment.entity';
import { MedicalConsultationNote } from './entities/medical-consultation-note.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment, MedicalConsultationNote])],
  controllers: [MedicalConsultationNotesController],
  providers: [MedicalConsultationNotesService],
})
export class MedicalConsultationNotesModule {}
