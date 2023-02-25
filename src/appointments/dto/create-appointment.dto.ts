import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';
import {
  CREATE_APPOINTMENT_DETAILS_DESCRIPTION,
  CREATE_APPOINTMENT_DETAILS_EXAMPLE,
  CREATE_APPOINTMENT_DOCUMENT_DESCRIPTION,
  CREATE_APPOINTMENT_DOCUMENT_EXAMPLE,
  CREATE_APPOINTMENT_START_DATE_TIME_DESCRIPTION,
  CREATE_APPOINTMENT_START_DATE_TIME_EXAMPLE,
} from '../constants';

export class CreateAppointmentDto {
  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({
    description: CREATE_APPOINTMENT_START_DATE_TIME_DESCRIPTION,
    example: CREATE_APPOINTMENT_START_DATE_TIME_EXAMPLE,
  })
  startDateTime: string;

  @IsNotEmpty()
  @ApiProperty({
    description: CREATE_APPOINTMENT_DETAILS_DESCRIPTION,
    example: CREATE_APPOINTMENT_DETAILS_EXAMPLE,
  })
  details: string;

  @IsNotEmpty()
  @ApiProperty({
    description: CREATE_APPOINTMENT_DOCUMENT_DESCRIPTION,
    example: CREATE_APPOINTMENT_DOCUMENT_EXAMPLE,
  })
  document: string;
}
