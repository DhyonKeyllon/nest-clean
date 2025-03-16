import { makeQuestion } from 'test/factories/make-question';
import { makeQuestionComment } from 'test/factories/make-question-comment';
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository';

import { ListQuestionCommentsUseCase } from './list-question-comments';

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let sut: ListQuestionCommentsUseCase; // system under test

describe('List question comments', async () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository();
    sut = new ListQuestionCommentsUseCase(inMemoryQuestionCommentsRepository);
  });

  test('should be able to list a question comments ', async () => {
    const question = makeQuestion();

    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({ questionId: question.id }),
    );
    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({ questionId: question.id }),
    );
    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({ questionId: question.id }),
    );

    const result = await sut.execute({
      page: 1,
      id: question.id.toString(),
    });

    expect(result.value?.questionComments).toHaveLength(3);
  });

  test('should be able to list a paginated question answers', async () => {
    const question = makeQuestion();

    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionCommentsRepository.create(
        makeQuestionComment({
          questionId: question.id,
        }),
      );
    }

    const result = await sut.execute({
      page: 2,
      id: question.id.toString(),
    });

    expect(result.value?.questionComments).toHaveLength(2);
  });
});
