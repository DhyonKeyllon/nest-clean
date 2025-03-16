import { Injectable } from '@nestjs/common';

import { Either, left, right } from '@/core/either';

import { Student } from '../../enterprise/entities/student';
import { HashGenerator } from '../cryptography/hash-generator';
import { StudentsRepository } from '../repositories/students-repository';
import { StudentAlreadyExistsError } from './errors/student-already-exists-error';

interface CreateStudentUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

type CreateStudentUseCaseResponse = Either<
  StudentAlreadyExistsError,
  {
    student: Student;
  }
>;

@Injectable()
export class CreateStudentUseCase {
  constructor(
    private studentsRepository: StudentsRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    email,
    password,
  }: CreateStudentUseCaseRequest): Promise<CreateStudentUseCaseResponse> {
    const studentAlreadyExists =
      await this.studentsRepository.findByEmail(email);

    if (studentAlreadyExists) return left(new StudentAlreadyExistsError(email));

    const hashedPassword = await this.hashGenerator.hash(password);

    const student = Student.create({
      name,
      email,
      password: hashedPassword,
    });

    await this.studentsRepository.create(student);

    return right({
      student,
    });
  }
}
