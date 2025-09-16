import { Prisma, Attachment as PrismaQuestionAttachment } from '@prisma/client';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  QuestionAttachment as DomainQuestionAttachment,
  QuestionAttachment,
} from '@/domain/forum/enterprise/entities/question-attachment';

export class PrismaQuestionAttachmentMapper {
  static toDomain(raw: PrismaQuestionAttachment): DomainQuestionAttachment {
    if (!raw.questionId) throw new Error('Invalid attachment type.');

    return DomainQuestionAttachment.create(
      {
        attachmentId: new UniqueEntityID(raw.id),
        questionId: new UniqueEntityID(raw.questionId),
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrismaUpdateMany(
    questionAttachments: QuestionAttachment[],
  ): Prisma.AttachmentUpdateManyArgs {
    const attachmentIds = questionAttachments.map((attachment) =>
      attachment.attachmentId.toString(),
    );

    return {
      where: {
        id: {
          in: attachmentIds,
        },
      },
      data: {
        questionId: questionAttachments[0].questionId.toString(),
      },
    };
  }
}
