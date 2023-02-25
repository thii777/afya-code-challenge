import { ApiProperty } from '@nestjs/swagger';
import { Appointment } from '../../appointments/entities/appointment.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import {
  MCN_ID_DESCRIPTION,
  MCN_EXAMPLE,
  MCN_APPOINTMENT_ID_DESCRIPTION,
  MCN_DATE_DESCRIPTION,
  MCN_DOCTOR_NAME_DESCRIPTION,
  MCN_NOTES_DESCRIPTION,
  MCN_PATIENT_NAME_DESCRIPTION,
} from '../constants';

@Entity()
export class MedicalConsultationNote {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: MCN_ID_DESCRIPTION, example: MCN_EXAMPLE.id })
  id: number;

  @Column()
  @ApiProperty({
    description: MCN_PATIENT_NAME_DESCRIPTION,
    example: MCN_EXAMPLE.patientName,
  })
  patientName: string;

  @Column()
  @ApiProperty({
    description: MCN_DOCTOR_NAME_DESCRIPTION,
    example: MCN_EXAMPLE.doctorName,
  })
  doctorName: string;

  @Column()
  @ApiProperty({ description: MCN_DATE_DESCRIPTION, example: MCN_EXAMPLE.date })
  date: Date;

  @Column()
  @ApiProperty({
    description: MCN_NOTES_DESCRIPTION,
    example: MCN_EXAMPLE.notes,
  })
  notes: string;

  @Column({ nullable: false, type: 'varchar' })
  @ManyToOne(() => Appointment)
  @ApiProperty({
    description: MCN_APPOINTMENT_ID_DESCRIPTION,
    example: MCN_EXAMPLE.appointmentId,
  })
  appointmentId: string;
}
