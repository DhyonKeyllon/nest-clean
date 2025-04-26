import {
  BadRequestException,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
  UsePipes,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { createZodDto, ZodValidationPipe } from '@anatine/zod-nestjs';
import { z } from 'zod';

import { ListQuestionCommentsUseCase } from '@/domain/forum/application/use-cases/list-question-comments';

import { CommentPresenter } from '../presenters/comment-presenter';

class ListQuestionCommentsQueryDto extends createZodDto(
  z.object({
    page: z
      .string()
      .optional()
      .default('1')
      .refine((value) => !isNaN(+value), {
        message: 'page must be a number',
      })
      .transform(Number)
      .pipe(z.number().min(1)),
  }),
) {}

@ApiTags('questions')
@Controller('/questions/:questionId/comments')
@ApiBearerAuth()
@UsePipes(ZodValidationPipe)
export class ListQuestionCommentsController {
  constructor(
    private listQuestionCommentsUseCase: ListQuestionCommentsUseCase,
  ) {}

  @Get()
  async handle(
    @Query() { page }: ListQuestionCommentsQueryDto,
    @Param('questionId', ParseUUIDPipe) questionId: string,
  ) {
    const result = await this.listQuestionCommentsUseCase.execute({
      id: questionId,
      page,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const comments = result.value.questionComments.map(CommentPresenter.toHTTP);

    return { comments };
  }
}
