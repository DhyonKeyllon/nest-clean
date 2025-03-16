import { Either, right } from '@/core/either';

import { QuestionComment } from '../../enterprise/entities/question-comment';
import { QuestionCommentsRepository } from '../repositories/question-comments-repository';

interface ListQuestionCommentsUseCaseRequest {
  page: number;
  id: string;
}

type ListQuestionCommentsUseCaseResponse = Either<
  null,
  {
    questionComments: QuestionComment[];
  }
>;

export class ListQuestionCommentsUseCase {
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

  async execute({
    id,
    page,
  }: ListQuestionCommentsUseCaseRequest): Promise<ListQuestionCommentsUseCaseResponse> {
    const questionComments =
      await this.questionCommentsRepository.findManyByQuestionId(id, {
        page,
      });

    return right({
      questionComments,
    });
  }
}
