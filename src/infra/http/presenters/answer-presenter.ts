import { Answer } from '@/domain/forum/enterprise/entities/answer';

export class AnswerPresenter {
  static toHTTP(answer: Answer) {
    return {
      id: answer.id.toString(),
      authorId: answer.authorId.toString(),
      content: answer.content,
      createdAt: answer.updatedAt,
      updatedAt: answer.updatedAt,
    };
  }
}
