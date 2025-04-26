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

import { CommentOnAnswerUseCase } from '@/domain/forum/application/use-cases/comment-on-answer';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';

class CommentOnAnswerBodySchema extends createZodDto(
  z.object({
    content: z.string(),
  }),
) {}

class CommentOnAnswerResponseSchema extends createZodDto(z.object({})) {}

@ApiTags('answers')
@Controller('/answers/:answerId/comments')
@UsePipes(new ZodValidationPipe())
@ApiBearerAuth()
export class CommentOnAnswerController {
  constructor(private commentOnAnswerUseCase: CommentOnAnswerUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: CommentOnAnswerResponseSchema,
  })
  async handle(
    @Body() body: CommentOnAnswerBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('answerId') answerId: string,
  ) {
    const { content } = body;
    const authorId = user.sub;

    const result = await this.commentOnAnswerUseCase.execute({
      content,
      answerId,
      authorId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
