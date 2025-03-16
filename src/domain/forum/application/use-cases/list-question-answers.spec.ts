import { makeAnswer } from 'test/factories/make-answer';
import { makeQuestion } from 'test/factories/make-question';
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';

import { ListQuestionAnswersUseCase } from './list-question-answers';

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: ListQuestionAnswersUseCase; // system under test

describe('List question answers', async () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    );
    sut = new ListQuestionAnswersUseCase(inMemoryAnswersRepository);
  });

  test('should be able to list a answers ', async () => {
    const question = makeQuestion();

    await inMemoryAnswersRepository.create(
      makeAnswer({ questionId: question.id }),
    );
    await inMemoryAnswersRepository.create(
      makeAnswer({ questionId: question.id }),
    );
    await inMemoryAnswersRepository.create(
      makeAnswer({ questionId: question.id }),
    );

    const result = await sut.execute({
      page: 1,
      id: question.id.toString(),
    });

    expect(result.value?.answers).toHaveLength(3);
  });

  test('should be able to list a paginated question answers', async () => {
    const question = makeQuestion();

    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswersRepository.create(
        makeAnswer({
          questionId: question.id,
        }),
      );
    }

    const result = await sut.execute({
      page: 2,
      id: question.id.toString(),
    });

    expect(result.value?.answers).toHaveLength(2);
  });
});
