import { Injectable } from '@nestjs/common';

import { PaginationParams } from '@/core/repositories/pagination-params';
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository';
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment';

import { PrismaAnswerCommentMapper } from '../mappers/prisma-answer-comment-mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  constructor(private readonly prismaService: PrismaService) {}

  async findById(id: string): Promise<AnswerComment | null> {
    const answerComment = await this.prismaService.comment.findUnique({
      where: { id },
    });

    if (!answerComment) return null;

    return PrismaAnswerCommentMapper.toDomain(answerComment);
  }

  async findManyByAnswerId(
    id: string,
    { page }: PaginationParams,
  ): Promise<AnswerComment[]> {
    const answerComments = await this.prismaService.comment.findMany({
      where: { answerId: id },
      take: 20,
      skip: (page - 1) * 20,
      orderBy: { createdAt: 'desc' },
    });

    return answerComments.map(PrismaAnswerCommentMapper.toDomain);
  }

  async create(answerComment: AnswerComment): Promise<void> {
    const data = PrismaAnswerCommentMapper.toPrisma(answerComment);

    await this.prismaService.comment.create({ data });
  }

  async delete(answerComment: AnswerComment): Promise<void> {
    await this.prismaService.comment.delete({
      where: { id: answerComment.id.toString() },
    });
  }
}
