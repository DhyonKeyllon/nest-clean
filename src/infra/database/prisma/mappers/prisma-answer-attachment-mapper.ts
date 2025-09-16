import { Prisma, Attachment as PrismaAnswerAttachment } from '@prisma/client';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  AnswerAttachment,
  AnswerAttachment as DomainAnswerAttachment,
} from '@/domain/forum/enterprise/entities/answer-attachment';

export class PrismaAnswerAttachmentMapper {
  static toDomain(raw: PrismaAnswerAttachment): DomainAnswerAttachment {
    if (!raw.answerId) throw new Error('Invalid attachment type.');

    return DomainAnswerAttachment.create(
      {
        attachmentId: new UniqueEntityID(raw.id),
        answerId: new UniqueEntityID(raw.answerId),
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrismaUpdateMany(
    answerAttachments: AnswerAttachment[],
  ): Prisma.AttachmentUpdateManyArgs {
    const attachmentIds = answerAttachments.map((attachment) =>
      attachment.attachmentId.toString(),
    );

    return {
      where: {
        id: {
          in: attachmentIds,
        },
      },
      data: {
        answerId: answerAttachments[0].answerId.toString(),
      },
    };
  }
}
