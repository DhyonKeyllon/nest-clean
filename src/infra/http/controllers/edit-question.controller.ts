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

import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';

class EditQuestionBodySchema extends createZodDto(
  z.object({
    title: z.string(),
    content: z.string(),
  }),
) {}

class EditQuestionResponseSchema extends createZodDto(z.object({})) {}

@ApiTags('questions')
@Controller('/questions/:id')
@UsePipes(new ZodValidationPipe())
@ApiBearerAuth()
export class EditQuestionController {
  constructor(private editQuestionUseCase: EditQuestionUseCase) {}

  @Put()
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: EditQuestionResponseSchema,
  })
  async handle(
    @Body() body: EditQuestionBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('id') questionId: string,
  ) {
    const { title, content } = body;
    const authorId = user.sub;

    const result = await this.editQuestionUseCase.execute({
      title,
      content,
      authorId,
      attachmentsIds: [],
      questionId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
