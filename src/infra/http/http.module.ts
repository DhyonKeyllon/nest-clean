import { Module } from '@nestjs/common';

import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student';
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question';
import { CreateStudentUseCase } from '@/domain/forum/application/use-cases/create-student';
import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug';
import { ListRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/list-recent-questions';

import { CryptographyModule } from '../cryptography/cryptography.module';
import { DatabaseModule } from '../database/database.module';
import { AuthenticateAccountController } from './controllers/authenticate.controller';
import { CreateAccountController } from './controllers/create-account.controller';
import { CreateQuestionController } from './controllers/create-question.controller';
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
  ],
  providers: [
    CreateQuestionUseCase,
    ListRecentQuestionsUseCase,
    CreateStudentUseCase,
    AuthenticateStudentUseCase,
    GetQuestionBySlugUseCase,
  ],
  exports: [],
})
export class HttpModule {}
