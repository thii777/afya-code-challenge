import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Appointment } from '../appointments/entities/appointment.entity';
import { Repository } from 'typeorm';
import { CreateMedicalConsultationNoteDto } from './dto/create-medical-consultation-note.dto';
import { MedicalConsultationNote } from './entities/medical-consultation-note.entity';
import { MedicalConsultationNotesService } from './medical-consultation-notes.service';

describe('MedicalConsultationNotesService', () => {
  let medicalConsultationNotesService: MedicalConsultationNotesService;
  let medicalConsultationNoteRepository: Repository<MedicalConsultationNote>;
  let appointmentRepository: Repository<Appointment>;

  const expectedMedicalConsultationNote: MedicalConsultationNote = {
    patientName: 'João da Silva',
    doctorName: 'Dra. Ana Souza',
    date: new Date(),
    notes:
      'Paciente apresentou sintomas de gripe e foi prescrito medicamento X.',
    appointmentId: '83476b53-97ab-4100-88c7-547c1c6301de',
    id: 5,
  };

  const mockCreateMedicalConsultationNoteDto: CreateMedicalConsultationNoteDto =
    {
      patientName: 'John Doe',
      doctorName: 'Dr. Smith',
      date: new Date(),
      notes: 'Lorem ipsum dolor sit amet',
      appointmentId: '83476b53-97ab-4100-88c7-547c1c6301de',
    };

  const appointment = {
    id: '970bcb8c-b9eb-42bf-9069-efc76fe79dd9',
    document: '33615840860',
    startDateTime: '2023-02-25T14:40:00.000Z',
    endDateTime: '2023-02-23T17:19:58.359Z',
    patient: '7a8753cd-c898-437e-8d1b-10b7e386916d',
    createdAt: '2023-02-23T17:19:58.359Z',
    updatedAt: '2023-02-23T17:19:58.359Z',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MedicalConsultationNotesService,
        {
          provide: getRepositoryToken(MedicalConsultationNote),
          useClass: jest.fn(() => ({
            save: jest.fn(),
            find: jest.fn(),
            createQueryBuilder: jest.fn(() => ({
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              select: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              getMany: jest.fn().mockResolvedValue([]),
            })),
          })),
        },
        {
          provide: 'AppointmentRepository',
          useClass: jest.fn(() => ({
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
          })),
        },
      ],
    }).compile();

    medicalConsultationNotesService =
      module.get<MedicalConsultationNotesService>(
        MedicalConsultationNotesService,
      );
    medicalConsultationNoteRepository = module.get<
      Repository<MedicalConsultationNote>
    >(getRepositoryToken(MedicalConsultationNote));
    appointmentRepository = module.get<Repository<Appointment>>(
      getRepositoryToken(Appointment),
    );
  });

  describe('create', () => {
    it('should create a medical consultation note successfully', async () => {
      jest
        .spyOn(medicalConsultationNoteRepository, 'save')
        .mockResolvedValue(expectedMedicalConsultationNote);

      appointmentRepository.findOne = jest.fn().mockResolvedValue(appointment);

      const result = await medicalConsultationNotesService.create({
        ...mockCreateMedicalConsultationNoteDto,
      });

      expect(medicalConsultationNoteRepository.save).toHaveBeenCalledWith(
        mockCreateMedicalConsultationNoteDto,
      );

      expect(result).toEqual(expectedMedicalConsultationNote);
    });
  });

  describe('findAllMedicalConsultationNotes', () => {
    it('should return an array of medical consultation notes', async () => {
      const patientId = '123';
      const queryBuilderMock =
        medicalConsultationNoteRepository.createQueryBuilder as jest.Mock;
      const expectedQueryBuilderResult = [
        { id: 1, doctorName: 'Dr. John', date: new Date(), notes: 'Notes' },
      ];

      // Simulando o resultado da query
      queryBuilderMock()
        .leftJoinAndSelect()
        .where()
        .select()
        .orderBy()
        .getMany.mockResolvedValue(expectedQueryBuilderResult);

      const result =
        await medicalConsultationNotesService.findAllMedicalConsultationNotes(
          patientId,
        );

      expect(queryBuilderMock).toHaveBeenCalledWith('medicalConsultationNote');

      const expectedMedicalConsultationNotes: MedicalConsultationNote[] = [
        {
          patientName: 'João da Silva',
          doctorName: 'Dra. Ana Souza',
          date: new Date(),
          notes:
            'Paciente apresentou sintomas de gripe e foi prescrito medicamento X.',
          appointmentId: '83476b53-97ab-4100-88c7-547c1c6301de',
          id: 5,
        },
      ];

      jest.spyOn(queryBuilderMock(), 'where').mockReturnThis();
      jest.spyOn(queryBuilderMock(), 'select').mockReturnThis();
      jest.spyOn(queryBuilderMock(), 'orderBy').mockReturnThis();
      jest
        .spyOn(queryBuilderMock(), 'getMany')
        .mockResolvedValue(expectedMedicalConsultationNotes);

      expect(queryBuilderMock).toHaveBeenCalledWith('medicalConsultationNote');
      expect(queryBuilderMock().where).toHaveBeenCalledWith(
        'appointment.patientId = :patientId',
        { patientId },
      );
      expect(queryBuilderMock().select).toHaveBeenCalledWith([
        'medicalConsultationNote.patientName',
        'medicalConsultationNote.doctorName',
        'medicalConsultationNote.date',
        'medicalConsultationNote.notes',
        'medicalConsultationNote.appointmentId',
        'medicalConsultationNote.id',
      ]);
      expect(queryBuilderMock().orderBy).toHaveBeenCalledWith(
        'medicalConsultationNote.date',
        'DESC',
      );
      expect(queryBuilderMock().getMany).toHaveBeenCalled();

      expect(result).toEqual(expectedMedicalConsultationNotes);
    });
  });
});
