import { makeAnswer } from 'test/factories/make-answer';
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository';
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';

import { CommentOnAnswerUseCase } from './comment-on-answer';

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let sut: CommentOnAnswerUseCase; // system under test

describe('Choose Answer Best Answer', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    );
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();

    sut = new CommentOnAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswerCommentsRepository,
    );
  });

  test('should be able to comment on answer', async () => {
    const answer = makeAnswer();

    await inMemoryAnswersRepository.create(answer);

    const result = await sut.execute({
      answerId: answer.id.toString(),
      authorId: 'author-1',
      content: 'Content text example',
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryAnswerCommentsRepository.items[0].content).toEqual(
      'Content text example',
    );
  });
});
