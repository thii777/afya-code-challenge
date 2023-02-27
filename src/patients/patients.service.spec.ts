import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ObjectGeneralMock } from '../mocks';
import { Patient } from './entities/patient.entity';
import { ObjectPatientMock } from './patients.mocks';
import { PatientsService } from './patients.service';
describe('PatientService', () => {
  let patientService: PatientsService;
  let patientRepository: Repository<Patient>;
  let objectGeneralMock: ObjectGeneralMock;
  let objectPatientMock: ObjectPatientMock;

  beforeEach(async () => {
    objectGeneralMock = new ObjectGeneralMock();
    objectPatientMock = new ObjectPatientMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PatientsService,
        {
          provide: getRepositoryToken(Patient),
          useClass: jest.fn(() => ({
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            find: jest.fn(),
          })),
        },
      ],
    }).compile();

    patientService = module.get<PatientsService>(PatientsService);
    patientRepository = module.get<Repository<Patient>>(
      getRepositoryToken(Patient),
    );
  });

  describe('create', () => {
    it('should create a new patient', async () => {
      const createPatientDto = objectPatientMock.createPatientDto;
      const expectedPatient = objectPatientMock.expectedPatient;
      jest.spyOn(patientRepository, 'save').mockResolvedValue(expectedPatient);

      const result = await patientService.create(createPatientDto);

      expect(patientRepository.save).toHaveBeenCalledWith(createPatientDto);
      expect(result).toEqual(expectedPatient);
    });
  });

  describe('update', () => {
    it('should update a patient successfully', async () => {
      const updatePatientDto = objectPatientMock.updatePatientDto;
      const expectedUpdatePatient = objectGeneralMock.objectAffected;
      const uuidMock = objectGeneralMock.uuidMock;
      jest
        .spyOn(patientRepository, 'update')
        .mockResolvedValue(expectedUpdatePatient);

      const result = await patientService.update(uuidMock, updatePatientDto);

      expect(patientRepository.update).toHaveBeenCalledWith(
        uuidMock,
        updatePatientDto,
      );
      expect(result).toEqual(expectedUpdatePatient);
    });
  });

  describe('findAll', () => {
    it('should return an array of patients', async () => {
      const patients = objectPatientMock.patients;
      patientRepository.find = jest.fn().mockResolvedValue(patients);

      await expect(patientService.findAll()).resolves.toEqual(patients);
    });
  });

  describe('remove', () => {
    it('should remove an patient successfully', async () => {
      const uuidMock = objectGeneralMock.uuidMock;
      const expectRemovePatient = objectGeneralMock.objectAffected;
      jest
        .spyOn(patientRepository, 'delete')
        .mockResolvedValue(expectRemovePatient);

      const result = await patientService.remove(uuidMock);

      expect(patientRepository.delete).toHaveBeenCalledWith(uuidMock);

      expect(result).toEqual(expectRemovePatient);
    });
  });
});
