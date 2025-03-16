import { makeQuestion } from 'test/factories/make-question';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository';
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';

import { CommentOnQuestionUseCase } from './comment-on-question';

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let sut: CommentOnQuestionUseCase; // system under test

describe('Choose Question Best Answer', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    );
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository();

    sut = new CommentOnQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionCommentsRepository,
    );
  });

  test('should be able to comment on question', async () => {
    const question = makeQuestion();

    await inMemoryQuestionsRepository.create(question);

    const result = await sut.execute({
      questionId: question.id.toString(),
      authorId: 'author-1',
      content: 'Content text example',
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryQuestionCommentsRepository.items[0].content).toEqual(
      'Content text example',
    );
  });
});
