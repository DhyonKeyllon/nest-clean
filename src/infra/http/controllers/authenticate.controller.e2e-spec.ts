import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { hash } from 'bcryptjs';
import request from 'supertest';

import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

describe('Authenticate (E2E)', async () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prismaService = moduleRef.get<PrismaService>(PrismaService);

    await app.init();
  });

  test('[POST] /sessions', async () => {
    const payload = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: await hash('123456', 8),
    };

    await prismaService.user.create({
      data: payload,
    });

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: payload.email,
      password: '123456',
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.access_token).toBeDefined();
  });
});
