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

import { CommentOnQuestionUseCase } from '@/domain/forum/application/use-cases/comment-on-question';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';

class CommentOnQuestionBodySchema extends createZodDto(
  z.object({
    content: z.string(),
  }),
) {}

class CommentOnQuestionResponseSchema extends createZodDto(z.object({})) {}

@ApiTags('questions')
@Controller('/questions/:questionId/comments')
@UsePipes(new ZodValidationPipe())
@ApiBearerAuth()
export class CommentOnQuestionController {
  constructor(private answerQuestionUseCase: CommentOnQuestionUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: CommentOnQuestionResponseSchema,
  })
  async handle(
    @Body() body: CommentOnQuestionBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('questionId') questionId: string,
  ) {
    const { content } = body;
    const authorId = user.sub;

    const result = await this.answerQuestionUseCase.execute({
      content,
      questionId,
      authorId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
