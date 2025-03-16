import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UsePipes,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { createZodDto, ZodValidationPipe } from '@anatine/zod-nestjs';
import { z } from 'zod';

import { ListRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/list-recent-questions';

import { QuestionPresenter } from '../presenters/question-presenter';

class ListRecentQuestionsQueryDto extends createZodDto(
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
@Controller('/questions')
@ApiBearerAuth()
@UsePipes(ZodValidationPipe)
export class ListRecentQuestionsController {
  constructor(private listRecentQuestionsUseCase: ListRecentQuestionsUseCase) {}

  @Get()
  async handle(@Query() { page }: ListRecentQuestionsQueryDto) {
    const result = await this.listRecentQuestionsUseCase.execute({
      page,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const questions = result.value.questions.map(QuestionPresenter.toHTTP);

    return { questions };
  }
}
