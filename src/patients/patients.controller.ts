import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DeleteResult, UpdateResult } from 'typeorm';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Patient } from './entities/patient.entity';
import { PatientsService } from './patients.service';

@ApiTags('patients')
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new patient' })
  @ApiResponse({
    status: 201,
    description: 'Patient created successfully..',
    type: Patient,
  })
  @ApiBadRequestResponse({
    description: 'Validation failed or patient not found.',
  })
  @ApiBody({ type: CreatePatientDto })
  create(@Body() createPatientDto: CreatePatientDto): Promise<Patient> {
    return this.patientsService.create(createPatientDto);
  }

  @Get()
  @ApiOperation({ summary: 'List patients' })
  @ApiResponse({
    status: 200,
    description: 'Patient listed successfully..',
    type: Patient,
  })
  @ApiBadRequestResponse({
    description: 'Validation failed or patient not found.',
  })
  findAll(): Promise<Patient[]> {
    return this.patientsService.findAll();
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an patient' })
  @ApiResponse({
    status: 200,
    description: 'Patient updated successfully..',
    type: Patient,
  })
  @ApiBadRequestResponse({
    description: 'Validation failed or patient not found.',
  })
  @ApiNotFoundResponse({
    description: 'Patient not found.',
  })
  @ApiBody({ type: UpdatePatientDto })
  update(
    @Param('id') id: string,
    @Body() updatePatientDto: UpdatePatientDto,
  ): Promise<UpdateResult> {
    return this.patientsService.update(id, updatePatientDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an patient' })
  @ApiNotFoundResponse({
    description: 'Patient not found.',
  })
  remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.patientsService.remove(id);
  }
}
