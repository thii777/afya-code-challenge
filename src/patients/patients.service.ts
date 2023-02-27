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
    private patientRepo: Repository<Patient>,
  ) {}

  create(createPatientDto: CreatePatientDto): Promise<Patient> {
    try {
      return this.patientRepo.save(createPatientDto);
    } catch (error) {
      if (error.message.includes('External service unavailable')) {
        return Promise.reject(error);
      }
      return error;
    }
  }

  findAll(): Promise<Patient[]> {
    return this.patientRepo.find();
  }

  update(id: any, updatePatientDto: UpdatePatientDto): Promise<UpdateResult> {
    return this.patientRepo.update(id, updatePatientDto);
  }

  remove(id: any): Promise<DeleteResult> {
    return this.patientRepo.delete(id);
  }
}
