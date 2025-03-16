import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { createZodDto, ZodValidationPipe } from '@anatine/zod-nestjs';
import { z } from 'zod';

import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student';
import { WrongCredentialsError } from '@/domain/forum/application/use-cases/errors/wrong-credentials-error';
import { Public } from '@/infra/auth/public';

class AuthenticateBodySchema extends createZodDto(
  z.object({
    email: z.string().email(),
    password: z.string().nonempty(),
  }),
) {}

@ApiTags('accounts')
@Controller('/sessions')
@UsePipes(ZodValidationPipe)
@Public()
export class AuthenticateAccountController {
  constructor(private authenticateStudentUseCase: AuthenticateStudentUseCase) {}

  @Post()
  async handle(@Body() { email, password }: AuthenticateBodySchema) {
    const result = await this.authenticateStudentUseCase.execute({
      email,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;

      // constructor returns the class of the error
      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { accessToken } = result.value;

    return {
      access_token: accessToken,
    };
  }
}
