import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from '../appointments/entities/appointment.entity';
import { MedicalConsultationNote } from './entities/medical-consultation-note.entity';
import { ObjectMCNMock } from './mcn.mocks';
import { MedicalConsultationNotesService } from './medical-consultation-notes.service';
import { ObjectAppoitmentMock } from '../appointments/appointment.mocks';

describe('MedicalConsultationNotesService', () => {
  let medicalConsultationNotesService: MedicalConsultationNotesService;
  let medicalConsultationNoteRepository: Repository<MedicalConsultationNote>;
  let appointmentRepository: Repository<Appointment>;
  let objectMCNMock: ObjectMCNMock;
  let objectAppoitmentMock: ObjectAppoitmentMock;

  beforeEach(async () => {
    objectMCNMock = new ObjectMCNMock();
    objectAppoitmentMock = new ObjectAppoitmentMock();

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
    let expectedMedicalConsultationNote;
    let mockCreateMedicalConsultationNoteDto;
    let appointment;
    it('should create a medical consultation note successfully', async () => {
      expectedMedicalConsultationNote = objectMCNMock.expectedMCNNote;
      mockCreateMedicalConsultationNoteDto = objectMCNMock.mockCreateMCNDto;
      appointment = objectAppoitmentMock.appointment;

      console.log(appointment, 'appoint');

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
    it('should handle errors when the medical consultation note service is unavailable', async () => {
      jest
        .spyOn(medicalConsultationNoteRepository, 'save')
        .mockRejectedValue(new Error('External service unavailable'));

      appointmentRepository.findOne = jest.fn().mockResolvedValue(appointment);
      medicalConsultationNoteRepository.save = jest
        .fn()
        .mockRejectedValue(new Error('External service unavailable'));

      await expect(
        medicalConsultationNotesService.create(
          mockCreateMedicalConsultationNoteDto,
        ),
      ).rejects.toThrowError();

      expect(medicalConsultationNoteRepository.save).toHaveBeenCalled();
    });
  });

  // describe('findAllMedicalConsultationNotes', () => {
  //   it('should return an array of medical consultation notes', async () => {
  //     const patientId = '123';
  //     const queryBuilderMock =
  //       medicalConsultationNoteRepository.createQueryBuilder as jest.Mock;
  //     const expectedQueryBuilderResult = [
  //       { id: 1, doctorName: 'Dr. John', date: new Date(), notes: 'Notes' },
  //     ];

  //     queryBuilderMock()
  //       .leftJoinAndSelect()
  //       .where()
  //       .select()
  //       .orderBy()
  //       .getMany.mockResolvedValue(expectedQueryBuilderResult);

  //     const result =
  //       await medicalConsultationNotesService.findAllMedicalConsultationNotes(
  //         patientId,
  //       );

  //     expect(queryBuilderMock).toHaveBeenCalledWith('medicalConsultationNote');

  //     const expectedMedicalConsultationNotes: MedicalConsultationNote[] = [
  //       {
  //         patientName: 'João da Silva',
  //         doctorName: 'Dra. Ana Souza',
  //         date: new Date(),
  //         notes:
  //           'Paciente apresentou sintomas de gripe e foi prescrito medicamento X.',
  //         appointmentId: '83476b53-97ab-4100-88c7-547c1c6301de',
  //         id: 5,
  //       },
  //     ];

  //     jest.spyOn(queryBuilderMock(), 'where').mockReturnThis();
  //     jest.spyOn(queryBuilderMock(), 'select').mockReturnThis();
  //     jest.spyOn(queryBuilderMock(), 'orderBy').mockReturnThis();
  //     jest
  //       .spyOn(queryBuilderMock(), 'getMany')
  //       .mockResolvedValue(expectedMedicalConsultationNotes);

  //     expect(queryBuilderMock).toHaveBeenCalledWith('medicalConsultationNote');
  //     expect(queryBuilderMock().where).toHaveBeenCalledWith(
  //       'appointment.patientId = :patientId',
  //       { patientId },
  //     );
  //     expect(queryBuilderMock().select).toHaveBeenCalledWith([
  //       'medicalConsultationNote.patientName',
  //       'medicalConsultationNote.doctorName',
  //       'medicalConsultationNote.date',
  //       'medicalConsultationNote.notes',
  //       'medicalConsultationNote.appointmentId',
  //       'medicalConsultationNote.id',
  //     ]);
  //     expect(queryBuilderMock().orderBy).toHaveBeenCalledWith(
  //       'medicalConsultationNote.date',
  //       'DESC',
  //     );
  //     expect(queryBuilderMock().getMany).toHaveBeenCalled();

  //     expect(result).toEqual(expectedMedicalConsultationNotes);
  //   });
  // });
});
