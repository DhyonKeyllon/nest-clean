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

import { ListAnswerCommentsUseCase } from '@/domain/forum/application/use-cases/list-answer-comments';

import { CommentPresenter } from '../presenters/comment-presenter';

class ListAnswerCommentsQueryDto extends createZodDto(
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

@ApiTags('answers')
@Controller('/answers/:answerId/comments')
@ApiBearerAuth()
@UsePipes(ZodValidationPipe)
export class ListAnswerCommentsController {
  constructor(private listAnswerCommentsUseCase: ListAnswerCommentsUseCase) {}

  @Get()
  async handle(
    @Query() { page }: ListAnswerCommentsQueryDto,
    @Param('answerId', ParseUUIDPipe) answerId: string,
  ) {
    const result = await this.listAnswerCommentsUseCase.execute({
      id: answerId,
      page,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const comments = result.value.answerComments.map(CommentPresenter.toHTTP);

    return { comments };
  }
}
