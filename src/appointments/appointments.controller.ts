import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DeleteResult, UpdateResult } from 'typeorm';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Appointment } from './entities/appointment.entity';

@ApiTags('appointments')
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @ApiOperation({ summary: 'Create a new appointment' })
  @Post()
  @ApiResponse({
    status: 201,
    description: 'appointment created successfully..',
    type: Appointment,
  })
  @ApiBadRequestResponse({
    description: 'Validation failed or appointment not found.',
  })
  @ApiBody({ type: CreateAppointmentDto })
  async create(
    @Body() createAppointmentDto: CreateAppointmentDto,
  ): Promise<CreateAppointmentDto> {
    const appointment = await this.appointmentsService.create(
      createAppointmentDto,
    );

    if (appointment.getResponse) {
      throw new HttpException(
        appointment.getResponse(),
        appointment.getStatus(),
      );
    }

    return appointment;
  }

  @ApiOperation({ summary: 'List appointments' })
  @Get()
  @ApiOkResponse({
    isArray: true,
    description: 'Returns a list of appointments.',
    type: Appointment,
  })
  @ApiBadRequestResponse({
    description: 'Validation failed or appointment not found.',
  })
  findAll(): Promise<Appointment[]> {
    return this.appointmentsService.findAll();
  }

  @ApiOperation({ summary: 'Update an appointment' })
  @Put(':id')
  @ApiResponse({
    status: 200,
    description: 'appointment updated successfully..',
    type: Appointment,
  })
  @ApiBadRequestResponse({
    description: 'Validation failed or appointment not found.',
  })
  @ApiNotFoundResponse({
    description: 'Appointment not found.',
  })
  @ApiBody({ type: UpdateAppointmentDto })
  update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ): Promise<UpdateResult> {
    return this.appointmentsService.update(id, updateAppointmentDto);
  }

  @ApiOperation({ summary: 'Delete an appointment' })
  @Delete(':id')
  @ApiBadRequestResponse({
    description: 'Validation failed or appointment not found.',
  })
  @ApiNotFoundResponse({
    description: 'Appointment not found.',
  })
  remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.appointmentsService.remove(id);
  }
}
