import { makeAnswer } from 'test/factories/make-answer';
import { makeAnswerComment } from 'test/factories/make-answer-comment';
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository';

import { ListAnswerCommentsUseCase } from './list-answer-comments';

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let sut: ListAnswerCommentsUseCase; // system under test

describe('List answer comments', async () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();
    sut = new ListAnswerCommentsUseCase(inMemoryAnswerCommentsRepository);
  });

  test('should be able to list a answer comments ', async () => {
    const answer = makeAnswer();

    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({ answerId: answer.id }),
    );
    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({ answerId: answer.id }),
    );
    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({ answerId: answer.id }),
    );

    const response = await sut.execute({
      page: 1,
      id: answer.id.toString(),
    });

    expect(response.isRight()).toBe(true);
    expect(response.value?.answerComments).toHaveLength(3);
  });

  test('should be able to list a paginated answer answers', async () => {
    const answer = makeAnswer();

    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({
          answerId: answer.id,
        }),
      );
    }

    const response = await sut.execute({
      page: 2,
      id: answer.id.toString(),
    });

    expect(response.isRight()).toBe(true);
    expect(response.value?.answerComments).toHaveLength(2);
  });
});
