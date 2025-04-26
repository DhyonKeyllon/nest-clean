import {
  BadRequestException,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  UsePipes,
} from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

import { createZodDto, ZodValidationPipe } from '@anatine/zod-nestjs';
import { z } from 'zod';

import { ChooseQuestionBestAnswerUseCase } from '@/domain/forum/application/use-cases/choose-question-best-answer';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';

class ChooseQuestionBestAnswerResponseSchema extends createZodDto(
  z.object({}),
) {}

@ApiTags('answers')
@Controller('/answers/:answerId/choose-as-best')
@UsePipes(new ZodValidationPipe())
@ApiBearerAuth()
export class ChooseQuestionBestAnswerController {
  constructor(private editQuestionUseCase: ChooseQuestionBestAnswerUseCase) {}

  @Patch()
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({
    description: 'The record has been successfully updated.',
    type: ChooseQuestionBestAnswerResponseSchema,
  })
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('answerId') answerId: string,
  ) {
    const authorId = user.sub;

    const result = await this.editQuestionUseCase.execute({
      authorId,
      answerId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
