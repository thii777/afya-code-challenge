import { ApiProperty } from '@nestjs/swagger';
import { MedicalConsultationNote } from '../../medical-consultation-notes/entities/medical-consultation-note.entity';
import { Patient } from '../../patients/entities/patient.entity';

import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  APPOINTMENT_CREATED_AT_DESCRIPTION,
  APPOINTMENT_CREATED_AT_EXAMPLE,
  APPOINTMENT_DOCUMENT_DESCRIPTION,
  APPOINTMENT_DOCUMENT_EXAMPLE,
  APPOINTMENT_END_DATETIME_DESCRIPTION,
  APPOINTMENT_END_DATETIME_EXAMPLE,
  APPOINTMENT_PATIENT_ID_DESCRIPTION,
  APPOINTMENT_PATIENT_ID_EXAMPLE,
  APPOINTMENT_START_DATETIME_DESCRIPTION,
  APPOINTMENT_START_DATETIME_EXAMPLE,
  APPOINTMENT_UPDATED_AT_DESCRIPTION,
  APPOINTMENT_UPDATED_AT_EXAMPLE,
} from '../constants';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, type: 'varchar' })
  @ApiProperty({
    description: APPOINTMENT_DOCUMENT_DESCRIPTION,
    example: APPOINTMENT_DOCUMENT_EXAMPLE,
  })
  document: string;

  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @ApiProperty({
    description: APPOINTMENT_START_DATETIME_DESCRIPTION,
    example: APPOINTMENT_START_DATETIME_EXAMPLE,
  })
  startDateTime: Date;

  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @ApiProperty({
    description: APPOINTMENT_END_DATETIME_DESCRIPTION,
    example: APPOINTMENT_END_DATETIME_EXAMPLE,
  })
  endDateTime: Date;

  @Column({ nullable: false, type: 'varchar' })
  @ManyToOne(() => Patient, { onDelete: 'SET NULL' })
  @ApiProperty({
    description: APPOINTMENT_PATIENT_ID_DESCRIPTION,
    example: APPOINTMENT_PATIENT_ID_EXAMPLE,
  })
  patientId: string;

  @OneToMany(
    () => MedicalConsultationNote,
    (medicalConsultationNote) => medicalConsultationNote.appointmentId,
  )
  MedicalConsultationNotes: MedicalConsultationNote[];

  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @ApiProperty({
    description: APPOINTMENT_CREATED_AT_DESCRIPTION,
    example: APPOINTMENT_CREATED_AT_EXAMPLE,
  })
  createdAt: Date;

  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @ApiProperty({
    description: APPOINTMENT_UPDATED_AT_DESCRIPTION,
    example: APPOINTMENT_UPDATED_AT_EXAMPLE,
  })
  updatedAt: Date;
}
