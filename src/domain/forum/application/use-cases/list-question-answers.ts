import { Injectable } from '@nestjs/common';

import { Either, right } from '@/core/either';

import { Answer } from '../../enterprise/entities/answer';
import { AnswersRepository } from '../repositories/answers-repository';

interface ListQuestionAnswersUseCaseRequest {
  page: number;
  id: string;
}

type ListQuestionAnswersUseCaseResponse = Either<
  null,
  {
    answers: Answer[];
  }
>;

@Injectable()
export class ListQuestionAnswersUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    id,
    page,
  }: ListQuestionAnswersUseCaseRequest): Promise<ListQuestionAnswersUseCaseResponse> {
    const answers = await this.answersRepository.findManyByQuestionId(id, {
      page,
    });

    return right({
      answers,
    });
  }
}
