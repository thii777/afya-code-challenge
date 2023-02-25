import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';
import {
  UPDATE_APPOINTMENT_DETAILS_DESCRIPTION,
  UPDATE_APPOINTMENT_DETAILS_EXAMPLE,
  UPDATE_APPOINTMENT_DOCUMENT_DESCRIPTION,
  UPDATE_APPOINTMENT_DOCUMENT_EXAMPLE,
  UPDATE_APPOINTMENT_START_DATE_TIME_DESCRIPTION,
  UPDATE_APPOINTMENT_START_DATE_TIME_EXAMPLE,
} from '../constants';
import { CreateAppointmentDto } from './create-appointment.dto';

export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {
  @IsDateString()
  @ApiProperty({
    description: UPDATE_APPOINTMENT_START_DATE_TIME_DESCRIPTION,
    example: UPDATE_APPOINTMENT_START_DATE_TIME_EXAMPLE,
  })
  startDateTime?: string;

  @ApiProperty({
    description: UPDATE_APPOINTMENT_DETAILS_DESCRIPTION,
    example: UPDATE_APPOINTMENT_DETAILS_EXAMPLE,
  })
  details?: string;

  @ApiProperty({
    description: UPDATE_APPOINTMENT_DOCUMENT_DESCRIPTION,
    example: UPDATE_APPOINTMENT_DOCUMENT_EXAMPLE,
  })
  document?: string;
}
