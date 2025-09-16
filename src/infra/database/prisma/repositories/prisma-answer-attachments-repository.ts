import { Injectable } from '@nestjs/common';

import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository';
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment';

import { PrismaAnswerAttachmentMapper } from '../mappers/prisma-answer-attachment-mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaAnswerAttachmentsRepository
  implements AnswerAttachmentsRepository
{
  constructor(private readonly prismaService: PrismaService) {}

  async findManyByAnswerId(id: string): Promise<AnswerAttachment[]> {
    const answerAttachments = await this.prismaService.attachment.findMany({
      where: {
        answerId: id,
      },
    });

    return answerAttachments.map(PrismaAnswerAttachmentMapper.toDomain);
  }

  async deleteManyByAnswerId(id: string): Promise<void> {
    await this.prismaService.attachment.deleteMany({
      where: {
        answerId: id,
      },
    });
  }

  async createMany(attachments: AnswerAttachment[]): Promise<void> {
    if (attachments.length === 0) return;

    const data = PrismaAnswerAttachmentMapper.toPrismaUpdateMany(attachments);

    await this.prismaService.attachment.updateMany(data);
  }

  async deleteMany(attachments: AnswerAttachment[]): Promise<void> {
    if (attachments.length === 0) return;

    const attachmentsIds = attachments.map((attachment) =>
      attachment.id.toString(),
    );

    await this.prismaService.attachment.deleteMany({
      where: {
        id: {
          in: attachmentsIds,
        },
      },
    });
  }
}
