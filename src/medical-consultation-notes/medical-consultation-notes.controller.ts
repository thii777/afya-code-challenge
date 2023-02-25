import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateMedicalConsultationNoteDto } from './dto/create-medical-consultation-note.dto';
import { MedicalConsultationNote } from './entities/medical-consultation-note.entity';
import { MedicalConsultationNotesService } from './medical-consultation-notes.service';

@ApiTags('medical-consultation-notes')
@Controller('medical-consultation-notes')
export class MedicalConsultationNotesController {
  constructor(
    private readonly medicalConsultationNotesService: MedicalConsultationNotesService,
  ) {}

  @ApiOperation({ summary: 'Create a new medical consultation notes' })
  @Post()
  @ApiResponse({
    status: 201,
    description: 'medical consultation notes created successfully..',
    type: MedicalConsultationNote,
  })
  @ApiBody({ type: CreateMedicalConsultationNoteDto })
  @ApiBadRequestResponse({
    description: 'Validation failed or appointment not found.',
  })
  async create(
    @Body() createMedicalConsultationNoteDto: CreateMedicalConsultationNoteDto,
  ): Promise<CreateMedicalConsultationNoteDto> {
    const medicalConsultationNotes =
      await this.medicalConsultationNotesService.create(
        createMedicalConsultationNoteDto,
      );

    if (medicalConsultationNotes.getResponse) {
      throw new HttpException(
        medicalConsultationNotes.getResponse(),
        medicalConsultationNotes.getStatus(),
      );
    }

    return medicalConsultationNotes;
  }

  @ApiOperation({ summary: 'List medical consultation notes by patients' })
  @ApiResponse({
    status: 201,
    description: 'list medical consultation notes successfully..',
    type: MedicalConsultationNote,
  })
  @ApiBadRequestResponse({
    description: 'Validation failed or appointment not found.',
  })
  @Get(':patientId')
  findAllMedicalConsultationNotes(
    @Param('patientId') patientId: string,
  ): Promise<CreateMedicalConsultationNoteDto[]> {
    return this.medicalConsultationNotesService.findAllMedicalConsultationNotes(
      patientId,
    );
  }
}
