import { Controller, Get, Query, UseGuards, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { createZodDto, ZodValidationPipe } from '@anatine/zod-nestjs';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { z } from 'zod';

// const pageQueryParamSchema = z
//   .string()
//   .optional()
//   .default('1')
//   .transform(Number)
//   .pipe(z.number().min(1));

// const FetchRecentQuestionsQueryDto = createZodDto(
//   z.object({
//     page: pageQueryParamSchema,
//   }),
// );

class FetchRecentQuestionsQueryDto extends createZodDto(
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
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@UsePipes(ZodValidationPipe)
export class FetchRecentQuestionsController {
  constructor(private prismaService: PrismaService) {}

  @Get()
  async handle(@Query() { page }: FetchRecentQuestionsQueryDto) {
    const perPage = 1;

    const questions = await this.prismaService.question.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: perPage,
      skip: (page - 1) * perPage,
    });

    return { questions };
  }
}
