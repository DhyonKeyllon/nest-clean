import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { patchNestjsSwagger } from '@anatine/zod-nestjs';

import { AppModule } from './app.module';
import { Env } from './env';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService<Env, true>>(ConfigService);
  const serverPort = configService.get('SERVER_PORT', { infer: true });
  patchNestjsSwagger();

  const TITLE = 'Nest Clean Architecture';
  const DESCRIPTION = 'The NestJS Clean Architecture Boilerplate';
  const API_VERSION = '1.0';

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle(TITLE)
    .setDescription(DESCRIPTION)
    .setVersion(API_VERSION)
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    ignoreGlobalPrefix: false,
  });

  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: TITLE,
  });

  logger.log(`listening app at ${serverPort}`);

  await app.listen(serverPort);

  const url = await app.getUrl();
  logger.log(`listening app at ${url}`);
}
bootstrap();
