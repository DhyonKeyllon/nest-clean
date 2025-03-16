import { User as PrismaStudent, Prisma } from '@prisma/client';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Student as DomainStudent } from '@/domain/forum/enterprise/entities/student';

export class PrismaStudentMapper {
  static toDomain(raw: PrismaStudent): DomainStudent {
    return DomainStudent.create(
      {
        email: raw.email,
        password: raw.password,
        name: raw.name,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(student: DomainStudent): Prisma.UserUncheckedCreateInput {
    return {
      id: student.id.toString(),
      name: student.name,
      email: student.email,
      password: student.password,
    };
  }
}
