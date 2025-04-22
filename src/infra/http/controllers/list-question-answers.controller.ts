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

import { ListQuestionAnswersUseCase } from '@/domain/forum/application/use-cases/list-question-answers';

import { AnswerPresenter } from '../presenters/answer-presenter';

class ListQuestionAnswersQueryDto extends createZodDto(
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
@Controller('/questions/:questionId/answers')
@ApiBearerAuth()
@UsePipes(ZodValidationPipe)
export class ListQuestionAnswersController {
  constructor(private listQuestionAnswersUseCase: ListQuestionAnswersUseCase) {}

  @Get()
  async handle(
    @Query() { page }: ListQuestionAnswersQueryDto,
    @Param('questionId', ParseUUIDPipe) questionId: string,
  ) {
    const result = await this.listQuestionAnswersUseCase.execute({
      id: questionId,
      page,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const answers = result.value.answers.map(AnswerPresenter.toHTTP);

    return { answers };
  }
}
