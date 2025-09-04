import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';

import request from 'supertest';
import { AttachmentFactory } from 'test/factories/make-attachment';
import { QuestionFactory } from 'test/factories/make-question';
import { QuestionAttachmentFactory } from 'test/factories/make-question-attachment';
import { StudentFactory } from 'test/factories/make-student';

import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

describe('Edit question (E2E)', async () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let jwtService: JwtService;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let attachmentFactory: AttachmentFactory;
  let questionAttachmentFactory: QuestionAttachmentFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AttachmentFactory,
        QuestionAttachmentFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();

    prismaService = moduleRef.get<PrismaService>(PrismaService);
    jwtService = moduleRef.get<JwtService>(JwtService);
    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    attachmentFactory = moduleRef.get(AttachmentFactory);
    questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory);

    await app.init();
  });

  test('[PUT] /questions/:id', async () => {
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwtService.sign({
      sub: user.id.toString(),
    });

    const attachment1 = await attachmentFactory.makePrismaAttachment();
    const attachment2 = await attachmentFactory.makePrismaAttachment();

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      questionId: question.id,
      attachmentId: attachment1.id,
    });

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      questionId: question.id,
      attachmentId: attachment2.id,
    });

    const attachment3 = await attachmentFactory.makePrismaAttachment();

    const stringifiedQuestionId = question.id.toString();

    const payload = {
      title: 'New title',
      content: 'This is a new content',
      attachments: [attachment1.id.toString(), attachment3.id.toString()],
    };

    const response = await request(app.getHttpServer())
      .put(`/questions/${stringifiedQuestionId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(payload);

    expect(response.statusCode).toBe(200);

    const questionOnDatabase = await prismaService.question.findFirst({
      where: {
        title: 'New title',
        content: 'This is a new content',
      },
    });

    expect(questionOnDatabase).not.toBeNull();
    expect(questionOnDatabase?.content).toBe(payload.content);

    const questionAttachmentsOnDatabase =
      await prismaService.attachment.findMany({
        where: {
          questionId: questionOnDatabase?.id,
        },
      });

    expect(questionAttachmentsOnDatabase).toHaveLength(2);
    expect(questionAttachmentsOnDatabase).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: attachment1.id.toString(),
        }),
        expect.objectContaining({
          id: attachment3.id.toString(),
        }),
      ]),
    );
  });
});
