import { Question as PrismaQuestion, Prisma } from '@prisma/client';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Question as DomainQuestion } from '@/domain/forum/enterprise/entities/question';
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug';

export class PrismaQuestionMapper {
  static toDomain(raw: PrismaQuestion): DomainQuestion {
    return DomainQuestion.create(
      {
        title: raw.title,
        content: raw.content,
        authorId: new UniqueEntityID(raw.authorId),
        slug: Slug.create(raw.slug),
        bestAnswerId: raw.bestAnswerId
          ? new UniqueEntityID(raw.bestAnswerId)
          : null,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(
    question: DomainQuestion,
  ): Prisma.QuestionUncheckedCreateInput {
    return {
      id: question.id.toString(),
      authorId: question.authorId.toString(),
      title: question.title,
      content: question.content,
      slug: question.slug.value,
      bestAnswerId: question.bestAnswerId?.toString(),
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    };
  }
}
