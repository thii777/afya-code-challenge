import { CreateMedicalConsultationNoteDto } from './dto/create-medical-consultation-note.dto';
import { MedicalConsultationNote } from './entities/medical-consultation-note.entity';
export class ObjectMCNMock {
  public expectedMCNNote: MedicalConsultationNote = {
    patientName: 'João da Silva',
    doctorName: 'Dra. Ana Souza',
    date: new Date(),
    notes:
      'Paciente apresentou sintomas de gripe e foi prescrito medicamento X.',
    appointmentId: '83476b53-97ab-4100-88c7-547c1c6301de',
    id: 5,
  };

  public mockCreateMCNDto: CreateMedicalConsultationNoteDto = {
    patientName: 'John Doe',
    doctorName: 'Dr. Smith',
    date: new Date(),
    notes: 'Lorem ipsum dolor sit amet',
    appointmentId: '83476b53-97ab-4100-88c7-547c1c6301de',
  };
}
