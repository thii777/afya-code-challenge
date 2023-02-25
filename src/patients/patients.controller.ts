import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBadRequestResponse, ApiBody, ApiNotFoundResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeleteResult, UpdateResult } from 'typeorm';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Patient } from './entities/patient.entity';
import { PatientsService } from './patients.service';

@ApiTags('patients')
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @ApiOperation({ summary: 'Create a new patient' })
  @Post()
  @ApiResponse({
    status: 201,
    description: 'Patient created successfully..',
    type: Patient,
  })
  @ApiBadRequestResponse({
    description: 'Validation failed or patient not found.',
  })
  @ApiBody({ type: CreatePatientDto })
  create(
    @Body() createPatientDto: CreatePatientDto,
  ): Promise<CreatePatientDto> {
    return this.patientsService.create(createPatientDto);
  }

  @ApiOperation({ summary: 'List patients' })
  @ApiResponse({
    status: 200,
    description: 'Patient listed successfully..',
    type: Patient,
  })
  @ApiBadRequestResponse({
    description: 'Validation failed or patient not found.',
  })
  @Get()
  findAll(): Promise<Patient[]> {
    return this.patientsService.findAll();
  }

  @ApiOperation({ summary: 'Update an patient' })
  @Put(':id')
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

  @ApiOperation({ summary: 'Delete an patient' })
  @ApiNotFoundResponse({
    description: 'Patient not found.',
  })
  @Delete(':id')
  remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.patientsService.remove(id);
  }
}
