import { Module } from '@nestjs/common';

import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question';
import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student';
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question';
import { CreateStudentUseCase } from '@/domain/forum/application/use-cases/create-student';
import { DeleteQuestionUseCase } from '@/domain/forum/application/use-cases/delete-question';
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question';
import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug';
import { ListRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/list-recent-questions';

import { CryptographyModule } from '../cryptography/cryptography.module';
import { DatabaseModule } from '../database/database.module';
import { AnswerQuestionController } from './controllers/answer-question.controller';
import { AuthenticateAccountController } from './controllers/authenticate.controller';
import { CreateAccountController } from './controllers/create-account.controller';
import { CreateQuestionController } from './controllers/create-question.controller';
import { DeleteQuestionController } from './controllers/delete-question.controller';
import { EditQuestionController } from './controllers/edit-question.controller';
import { GetQuestionBySlugController } from './controllers/get-question-by-slug.controller';
import { ListRecentQuestionsController } from './controllers/list-recent-questions.controller';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateAccountController,
    CreateQuestionController,
    ListRecentQuestionsController,
    GetQuestionBySlugController,
    EditQuestionController,
    DeleteQuestionController,
    AnswerQuestionController,
  ],
  providers: [
    CreateQuestionUseCase,
    ListRecentQuestionsUseCase,
    CreateStudentUseCase,
    AuthenticateStudentUseCase,
    GetQuestionBySlugUseCase,
    EditQuestionUseCase,
    DeleteQuestionUseCase,
    AnswerQuestionUseCase,
  ],
  exports: [],
})
export class HttpModule {}
