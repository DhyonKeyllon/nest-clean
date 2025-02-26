import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

import { createZodDto, ZodValidationPipe } from '@anatine/zod-nestjs';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { z } from 'zod';

class CreateQuestionResponseSchema extends createZodDto(z.object({})) {}

@ApiTags('questions')
@Controller('/questions')
@UsePipes(new ZodValidationPipe())
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private prismaService: PrismaService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: CreateQuestionResponseSchema,
  })
  async handle() {
    return 'ok';
  }
}
