import { Attachment as PrismaAttachment, Prisma } from '@prisma/client';

import { Attachment as DomainAttachment } from '@/domain/forum/enterprise/entities/attachment';

export class PrismaAttachmentMapper {
  static toDomain(raw: PrismaAttachment): DomainAttachment {
    return DomainAttachment.create({
      title: raw.title,
      url: raw.url,
    });
  }

  static toPrisma(
    attachment: DomainAttachment,
  ): Prisma.AttachmentUncheckedCreateInput {
    return {
      id: attachment.id.toString(),
      title: attachment.title,
      url: attachment.url,
    };
  }
}
