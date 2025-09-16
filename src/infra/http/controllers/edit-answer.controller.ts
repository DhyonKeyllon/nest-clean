import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  UsePipes,
} from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

import { createZodDto, ZodValidationPipe } from '@anatine/zod-nestjs';
import { z } from 'zod';

import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';

class EditAnswerBodySchema extends createZodDto(
  z.object({
    content: z.string(),
    attachments: z.array(z.string().uuid()).default([]),
  }),
) {}

class EditAnswerResponseSchema extends createZodDto(z.object({})) {}

@ApiTags('questions')
@Controller('/answers/:id')
@UsePipes(new ZodValidationPipe())
@ApiBearerAuth()
export class EditAnswerController {
  constructor(private editAnswerUseCase: EditAnswerUseCase) {}

  @Put()
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({
    description: 'The record has been successfully updated.',
    type: EditAnswerResponseSchema,
  })
  async handle(
    @Body() body: EditAnswerBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('id') answerId: string,
  ) {
    const { content, attachments } = body;
    const authorId = user.sub;

    const result = await this.editAnswerUseCase.execute({
      content,
      authorId,
      attachmentsIds: attachments,
      answerId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
