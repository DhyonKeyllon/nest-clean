import { Injectable } from '@nestjs/common';

import { PaginationParams } from '@/core/repositories/pagination-params';
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository';
import { Answer } from '@/domain/forum/enterprise/entities/answer';

import { PrismaAnswerMapper } from '../mappers/prisma-answer-mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaAnswersRepository implements AnswersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findById(id: string): Promise<Answer | null> {
    const answer = await this.prismaService.answer.findUnique({
      where: { id },
    });

    if (!answer) return null;

    return PrismaAnswerMapper.toDomain(answer);
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<Answer[]> {
    const answers = await this.prismaService.answer.findMany({
      where: { questionId },
      take: 20,
      skip: (page - 1) * 20,
      orderBy: { createdAt: 'desc' },
    });

    return answers.map(PrismaAnswerMapper.toDomain);
  }

  async create(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPrisma(answer);

    await this.prismaService.answer.create({ data });
  }

  async save(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPrisma(answer);

    await this.prismaService.answer.update({
      where: { id: answer.id.toString() },
      data,
    });
  }

  async delete(answer: Answer): Promise<void> {
    await this.prismaService.answer.delete({
      where: { id: answer.id.toString() },
    });
  }
}
