import { Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found';

import { Question } from '../../enterprise/entities/question';
import { AnswersRepository } from '../repositories/answers-repository';
import { QuestionsRepository } from '../repositories/questions-repository';

interface ChooseQuestionBestAnswerUseCaseRequest {
  answerId: string;
  authorId: string;
}

type ChooseQuestionBestAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: Question;
  }
>;

export class ChooseQuestionBestAnswerUseCase {
  constructor(
    private answersRepository: AnswersRepository,
    private questionRepository: QuestionsRepository,
  ) {}

  async execute({
    answerId,
    authorId,
  }: ChooseQuestionBestAnswerUseCaseRequest): Promise<ChooseQuestionBestAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId);

    if (!answer) return left(new ResourceNotFoundError());

    const question = await this.questionRepository.findById(
      answer.questionId.toString(),
    );

    if (!question) return left(new ResourceNotFoundError());

    if (authorId !== question.authorId.toString())
      return left(new NotAllowedError());

    question.bestAnswerId = answer.id;

    await this.questionRepository.save(question);

    return right({
      question,
    });
  }
}
