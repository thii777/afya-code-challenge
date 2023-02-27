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
});
