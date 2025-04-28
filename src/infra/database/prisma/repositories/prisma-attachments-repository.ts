import { Injectable } from '@nestjs/common';

import { AttachmentsRepository } from '@/domain/forum/application/repositories/attachments-repository';
import { Attachment } from '@/domain/forum/enterprise/entities/attachment';

import { PrismaAttachmentMapper } from '../mappers/prisma-attachment-mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaAttachmentsRepository implements AttachmentsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(Attachment: Attachment): Promise<void> {
    const data = PrismaAttachmentMapper.toPrisma(Attachment);

    await this.prismaService.attachment.create({ data });
  }
}
