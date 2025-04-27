import { faker } from '@faker-js/faker/.';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  Attachment,
  AttachmentProps,
} from '@/domain/forum/enterprise/entities/attachment';

export function makeAttachment(
  override: Partial<AttachmentProps> = {},
  id?: UniqueEntityID,
) {
  const attachment = Attachment.create(
    {
      title: faker.lorem.sentence(4),
      url: faker.internet.url(),
      ...override,
    },
    id,
  );
  return attachment;
}
