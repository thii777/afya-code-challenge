import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Patient } from './entities/patient.entity';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
  ) {}

  create(createPatientDto: CreatePatientDto): Promise<CreatePatientDto> {
    return this.patientRepository.save(createPatientDto);
  }

  findAll(): Promise<Patient[]> {
    return this.patientRepository.find();
  }

  update(id: any, updatePatientDto: UpdatePatientDto): Promise<UpdateResult> {
    return this.patientRepository.update(id, updatePatientDto);
  }

  remove(id: any): Promise<DeleteResult> {
    return this.patientRepository.delete(id);
  }
}
