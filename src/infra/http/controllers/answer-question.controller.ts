import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UsePipes,
} from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

import { createZodDto, ZodValidationPipe } from '@anatine/zod-nestjs';
import { z } from 'zod';

import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';

class AnswerQuestionBodySchema extends createZodDto(
  z.object({
    content: z.string(),
    attachments: z.array(z.string().uuid()),
  }),
) {}

class AnswerQuestionResponseSchema extends createZodDto(z.object({})) {}

@ApiTags('questions')
@Controller('/questions/:questionId/answers')
@UsePipes(new ZodValidationPipe())
@ApiBearerAuth()
export class AnswerQuestionController {
  constructor(private answerQuestionUseCase: AnswerQuestionUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: AnswerQuestionResponseSchema,
  })
  async handle(
    @Body() body: AnswerQuestionBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('questionId') questionId: string,
  ) {
    const { content, attachments } = body;
    const authorId = user.sub;

    const result = await this.answerQuestionUseCase.execute({
      content,
      questionId,
      authorId,
      attachmentsIds: attachments,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
