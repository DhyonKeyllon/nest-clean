import { makeQuestion } from 'test/factories/make-question';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';

import { ListRecentQuestionsUseCase } from './list-recent-questions';

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: ListRecentQuestionsUseCase; // system under test

describe('List questions', async () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    );
    sut = new ListRecentQuestionsUseCase(inMemoryQuestionsRepository);
  });

  test('should be able to list a recent questions ', async () => {
    await inMemoryQuestionsRepository.create(
      makeQuestion({ createdAt: new Date(2022, 5, 11) }),
    );
    await inMemoryQuestionsRepository.create(
      makeQuestion({ createdAt: new Date(2025, 0, 19) }),
    );
    await inMemoryQuestionsRepository.create(
      makeQuestion({ createdAt: new Date(2024, 2, 9) }),
    );

    const result = await sut.execute({
      page: 1,
    });

    expect(result.value?.questions).toEqual([
      expect.objectContaining({ createdAt: new Date(2025, 0, 19) }),
      expect.objectContaining({ createdAt: new Date(2024, 2, 9) }),
      expect.objectContaining({ createdAt: new Date(2022, 5, 11) }),
    ]);
  });

  test('should be able to list a paginated questions', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionsRepository.create(makeQuestion());
    }

    const result = await sut.execute({
      page: 2,
    });

    expect(result.value?.questions).toHaveLength(2);
  });
});
