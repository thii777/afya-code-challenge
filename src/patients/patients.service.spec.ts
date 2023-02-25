import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Patient } from './entities/patient.entity';
import { PatientsService } from './patients.service';

describe('PatientService', () => {
  let patientService: PatientsService;
  let patientRepository: Repository<Patient>;

  const uuidMock = '970bcb8c-b9eb-42bf-9069-efc76fe79dd9';

  const expectUpdatePatient = {
    generatedMaps: [],
    raw: [],
    affected: 1,
  };

  const expectRemovePatient = {
    ...expectUpdatePatient,
  };

  const createPatientDto: CreatePatientDto = {
    name: 'Fulano de Tal',
    phone: '+5511999999999',
    email: 'fulano@example.com',
    document: '123456789',
    birthday: '2000-01-01',
    gender: 'M',
    height: '1.75',
    weight: '70',
  };

  const expectedUpdatePatient: UpdatePatientDto = {
    phone: '+5511999999999',
    email: 'fulano@example.com',
  };

  const expectedPatient: Patient = {
    ...createPatientDto,
    id: 'd48a9772-914c-4293-b3e3-096604f693d1',
    birthday: new Date(),
    appointments: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const patients = [
    {
      name: 'Thiago documentation',
      phone: '+55 11 99999-9999.',
      email: 'thiago.update@gmail.com',
      document: '33615840864',
      birthday: '1986-09-05 14:40:00.000Z',
      gender: 'male',
      height: '168',
      weight: '68',
      id: '91bf8fe2-3e78-4747-ac8d-68a88c390399',
      createdAt: '2023-02-24T19:20:30.338Z',
      updatedAt: '2023-02-24T19:20:30.338Z',
    },
  ];

  beforeEach(async () => {
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
      jest.spyOn(patientRepository, 'save').mockResolvedValue(expectedPatient);

      const result = await patientService.create(createPatientDto);

      expect(patientRepository.save).toHaveBeenCalledWith(createPatientDto);
      expect(result).toEqual(expectedPatient);
    });
  });

  describe('update', () => {
    it('should update a patient successfully', async () => {
      jest
        .spyOn(patientRepository, 'update')
        .mockResolvedValue(expectRemovePatient);

      const result = await patientService.update(
        uuidMock,
        expectedUpdatePatient,
      );

      expect(patientRepository.update).toHaveBeenCalledWith(
        uuidMock,
        expectedUpdatePatient,
      );
      expect(result).toEqual(expectRemovePatient);
    });
  });

  describe('findAll', () => {
    it('should return an array of patients', async () => {
      patientRepository.find = jest.fn().mockResolvedValue(patients);

      await expect(patientService.findAll()).resolves.toEqual(patients);
    });
  });

  describe('remove', () => {
    it('should remove an patient successfully', async () => {
      jest
        .spyOn(patientRepository, 'delete')
        .mockResolvedValue(expectRemovePatient);

      const result = await patientService.remove(uuidMock);

      expect(patientRepository.delete).toHaveBeenCalledWith(uuidMock);

      expect(result).toEqual(expectRemovePatient);
    });
  });
});
