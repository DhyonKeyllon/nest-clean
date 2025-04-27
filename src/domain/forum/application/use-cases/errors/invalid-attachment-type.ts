import { UseCaseError } from '@/core/errors/use-case-error';

export class InvalidAttachmentType extends Error implements UseCaseError {
  constructor(type: string) {
    super(`Attachment type "${type}" is not supported.`);
  }
}
