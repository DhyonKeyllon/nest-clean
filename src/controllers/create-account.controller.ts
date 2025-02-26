import {
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
import { hash } from 'bcryptjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { z } from 'zod';

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
export class CreateAccountController {
  constructor(private prismaService: PrismaService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: CreateAccountResponseSchema,
  })
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, email, password } = body;

    const userWithSameEmail = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (userWithSameEmail) {
      throw new ConflictException('User with same email already exists');
    }

    const hashedPassword = await hash(password, 8);

    await this.prismaService.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
  }
}
