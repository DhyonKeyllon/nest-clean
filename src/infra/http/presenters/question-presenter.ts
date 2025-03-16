import { Question } from '@/domain/forum/enterprise/entities/question';

export class QuestionPresenter {
  static toHTTP(question: Question) {
    return {
      id: question.id.toString(),
      authorId: question.authorId.toString(),
      bestAnswerId: question.bestAnswerId?.toString(),
      title: question.title,
      content: question.content,
      slug: question.slug.value,
      createdAt: question.updatedAt,
      updatedAt: question.updatedAt,
    };
  }
}
