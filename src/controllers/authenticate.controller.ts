import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiTags } from '@nestjs/swagger';

import { createZodDto, ZodValidationPipe } from '@anatine/zod-nestjs';
import { compare } from 'bcryptjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { z } from 'zod';

class AuthenticateBodySchema extends createZodDto(
  z.object({
    email: z.string().email(),
    password: z.string().nonempty(),
  }),
) {}

@ApiTags('accounts')
@Controller('/sessions')
@UsePipes(ZodValidationPipe)
export class AuthenticateAccountController {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  @Post()
  async handle(@Body() { email, password }: AuthenticateBodySchema) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    const accessToken = this.jwtService.sign({
      sub: user.id,
    });

    return {
      access_token: accessToken,
    };
  } // @Body() body: CreateAccountBodySchema
}
