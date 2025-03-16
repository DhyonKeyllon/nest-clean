import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';

import request from 'supertest';

import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

describe('Create question (E2E)', async () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prismaService = moduleRef.get<PrismaService>(PrismaService);
    jwtService = moduleRef.get<JwtService>(JwtService);

    await app.init();
  });

  test('[POST] /questions', async () => {
    const user = await prismaService.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456',
      },
    });

    const accessToken = jwtService.sign({
      sub: user.id,
    });

    const payload = {
      title: 'New question',
      content: 'This is a new question',
    };

    const response = await request(app.getHttpServer())
      .post('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(payload);

    expect(response.statusCode).toBe(201);

    const questionOnDatabase = await prismaService.question.findFirst({
      where: {
        title: payload.title,
      },
    });

    expect(questionOnDatabase).not.toBeNull();
    expect(questionOnDatabase?.content).toBe(payload.content);
  });
});
