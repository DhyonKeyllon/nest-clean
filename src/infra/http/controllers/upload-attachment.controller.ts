import {
  BadRequestException,
  Controller,
  FileTypeValidator,
  InternalServerErrorException,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { InvalidAttachmentType } from '@/domain/forum/application/use-cases/errors/invalid-attachment-type';
import { WrongCredentialsError } from '@/domain/forum/application/use-cases/errors/wrong-credentials-error';
import { UploadAndCreateAttachmentUseCase } from '@/domain/forum/application/use-cases/upload-and-create-attachment';

@ApiTags('attachments')
@Controller('/attachments')
@ApiBearerAuth()
export class UploadAttachmentController {
  constructor(
    private readonly uploadAndCreateAttachmentUseCase: UploadAndCreateAttachmentUseCase,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async handle(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 2, // 2MB
          }),
          new FileTypeValidator({
            fileType: '.(png|jpg|jpeg|pdf)',
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const result = await this.uploadAndCreateAttachmentUseCase.execute({
      fileName: file.originalname,
      fileType: file.mimetype,
      body: file.buffer,
    });

    if (result.isLeft()) {
      const error = result.value;

      // constructor returns the class of the error
      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message);
        case InvalidAttachmentType:
          throw new BadRequestException();
        default:
          throw new InternalServerErrorException(error.message);
      }
    }

    const { attachment } = result.value;

    return {
      attachmentId: attachment.id.toString(),
    };
  }
}
