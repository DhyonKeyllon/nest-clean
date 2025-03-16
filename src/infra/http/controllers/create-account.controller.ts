import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

import { createZodDto, ZodValidationPipe } from '@anatine/zod-nestjs';
import { z } from 'zod';

import { CreateStudentUseCase } from '@/domain/forum/application/use-cases/create-student';
import { StudentAlreadyExistsError } from '@/domain/forum/application/use-cases/errors/student-already-exists-error';
import { Public } from '@/infra/auth/public';

class CreateAccountBodySchema extends createZodDto(
  z.object({
    name: z.string().nonempty(),
    email: z.string().email(),
    password: z.string().nonempty(),
  }),
) {}

class CreateAccountResponseSchema extends createZodDto(
  z.object({
    id: z.string().uuid(),
    name: z.string().email(),
    email: z.string(),
  }),
) {}

@ApiTags('accounts')
@Controller('/accounts')
@UsePipes(new ZodValidationPipe())
@Public()
export class CreateAccountController {
  constructor(private createStudent: CreateStudentUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: CreateAccountResponseSchema,
  })
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, email, password } = body;

    const result = await this.createStudent.execute({
      name,
      email,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;

      // constructor returns the class of the error
      switch (error.constructor) {
        case StudentAlreadyExistsError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
