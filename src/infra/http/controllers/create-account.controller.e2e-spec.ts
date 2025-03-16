import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import request from 'supertest';

import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

describe('Create account (E2E)', async () => {
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

  test('[POST] /accounts', async () => {
    const payload = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    };

    const response = await request(app.getHttpServer())
      .post('/accounts')
      .send(payload);

    expect(response.statusCode).toBe(201);

    const userOnDatabase = await prismaService.user.findUnique({
      where: {
        email: payload.email,
      },
    });

    expect(userOnDatabase).not.toBeNull();
    expect(userOnDatabase?.name).toBe(payload.name);
  });
});
