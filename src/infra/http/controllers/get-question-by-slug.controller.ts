import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug';

import { QuestionPresenter } from '../presenters/question-presenter';

@ApiTags('questions')
@Controller('/questions/:slug')
@ApiBearerAuth()
export class GetQuestionBySlugController {
  constructor(private getQuestionBySlugUseCase: GetQuestionBySlugUseCase) {}

  @Get()
  async handle(@Param('slug') slug: string) {
    const result = await this.getQuestionBySlugUseCase.execute({
      slug,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const question = QuestionPresenter.toHTTP(result.value.question);

    return { question };
  }
}
